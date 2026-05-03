import { internalAction, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { withSentry } from "./lib/sentry";
import type { ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

// ============================================
// HELPERS — WebCrypto JWT for Google OAuth2
// ============================================

/**
 * Base64url-encodes a string or Uint8Array without padding.
 */
function base64url(input: string | Uint8Array): string {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : input;

  // btoa expects a binary string
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Exchanges a service-account JSON key for a short-lived Google OAuth2
 * access token scoped to Firebase Cloud Messaging.
 *
 * Uses the WebCrypto API (available in both the Convex V8 and Node runtimes)
 * so no Node-only modules are required.
 */
async function getGoogleAccessToken(
  clientEmail: string,
  privateKeyPem: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );

  const signingInput = `${header}.${payload}`;

  // Strip PEM armor and decode the DER bytes
  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");

  const derBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    derBytes.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const signature = base64url(new Uint8Array(signatureBuffer));
  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Google OAuth2 token error: ${text}`);
  }

  const data = (await tokenRes.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Fetches a Google OAuth2 access token, retrying once after 1 second if the
 * first attempt fails (network blip resilience).
 */
async function getGoogleAccessTokenWithRetry(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  try {
    return await getGoogleAccessToken(clientEmail, privateKey);
  } catch (firstErr) {
    console.warn("[FCM] Access token fetch failed, retrying in 1s:", firstErr);
    await new Promise((r) => setTimeout(r, 1000));
    return await getGoogleAccessToken(clientEmail, privateKey);
  }
}

/**
 * Sends a single FCM push notification via the HTTP v1 API.
 * Returns false if the token is stale/invalid (caller can clean it up).
 */
async function sendFCMMessage(
  projectId: string,
  accessToken: string,
  fcmToken: string,
  title: string,
  body: string
): Promise<boolean> {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: fcmToken,
          notification: { title, body },
          webpush: {
            notification: {
              title,
              body,
              icon: "/favicon.ico",
              badge: "/favicon.ico",
              requireInteraction: false,
            },
            fcm_options: {
              link: "/dashboard",
            },
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const code = (err as { error?: { status?: string } }).error?.status;
    // UNREGISTERED / INVALID_ARGUMENT means the token is stale
    if (code === "UNREGISTERED" || code === "INVALID_ARGUMENT") {
      return false;
    }
    console.error("FCM send error:", JSON.stringify(err));
  }

  return true;
}

// ============================================
// TIMEZONE HELPERS
// ============================================

/**
 * Returns the current "HH:MM" (24-hour, zero-padded) in the given IANA
 * timezone, e.g. "07:30" for 07:30 AM in "America/New_York".
 */
function localTimeString(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date());

    const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "00";

    // Normalise "24:xx" → "00:xx" (Intl edge case at midnight in some locales)
    const h = parseInt(hour, 10) % 24;
    return `${String(h).padStart(2, "0")}:${minute.padStart(2, "0")}`;
  } catch {
    // Unknown / malformed timezone — fall back to UTC
    const now = new Date();
    return `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;
  }
}

/**
 * Returns the current "YYYY-MM-DD" date string in the given IANA timezone.
 * Matches the convention used in habitCompletions.date.
 */
function localDateString(timezone: string): string {
  try {
    // en-CA formats as YYYY-MM-DD natively
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year")?.value ?? "";
    const month = parts.find((p) => p.type === "month")?.value ?? "";
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    return `${year}-${month}-${day}`;
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

// ============================================
// SCAN OPTIONS
// ============================================

interface ScanOpts {
  /**
   * Walk through the logic and log what WOULD be sent, but don't call FCM
   * and don't write reminderLog entries.
   */
  dryRun?: boolean;
  /**
   * Skip the FCM HTTP call entirely; treat every send as successful.
   * DOES write reminderLog (so you can verify idempotency without real Firebase).
   */
  mockMode?: boolean;
}

// ============================================
// CORE SCAN — shared by cron + manual trigger
// ============================================

/**
 * Runs the full reminder-scan pipeline.
 * Factored out of sendHabitReminders so triggerRemindersNow can reuse it
 * without duplicating code.
 */
async function runReminderScan(
  ctx: ActionCtx,
  opts: ScanOpts = {}
): Promise<void> {
  const { dryRun = false, mockMode = false } = opts;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    console.log(
      "[FCM] Firebase Admin credentials not configured — skipping push notifications."
    );
    return;
  }

  // Unescape \n sequences stored in env vars
  const privateKey = rawKey.replace(/\\n/g, "\n");

  // 1. Fetch all registered tokens
  const tokens: Array<{
    _id: string;
    userId: string;
    token: string;
    timezone: string;
  }> = await ctx.runQuery(internal.pushTokens.getAllTokensWithTimezones, {});

  if (tokens.length === 0) return;

  // 2. Get access token once — reuse for all sends in this run
  //    Skip in dryRun and mockMode since no real FCM calls are made
  let accessToken = "";
  if (!dryRun && !mockMode) {
    try {
      accessToken = await getGoogleAccessTokenWithRetry(clientEmail, privateKey);
    } catch (e) {
      console.error("[FCM] Failed to get access token (after retry):", {
        error: String(e),
        clientEmail,
      });
      throw e; // Rethrow so withSentry captures it
    }
  }

  // 3. Group tokens by userId × localTime to avoid N+1 habit queries
  const groups = new Map<
    string,
    {
      userId: string;
      localTime: string;
      localDate: string;
      tokens: string[];
      tokenIds: string[];
    }
  >();

  for (const t of tokens) {
    const localTime = localTimeString(t.timezone);
    const localDate = localDateString(t.timezone);
    const key = `${t.userId}::${localTime}`;

    if (!groups.has(key)) {
      groups.set(key, {
        userId: t.userId,
        localTime,
        localDate,
        tokens: [],
        tokenIds: [],
      });
    }
    const g = groups.get(key)!;
    g.tokens.push(t.token);
    g.tokenIds.push(t._id);
  }

  // 4. For each group, find matching habits and send
  for (const group of groups.values()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let habits: Array<{ _id: string; title: string }> = [];

    try {
      habits = await ctx.runQuery(
        internal.pushTokens.getActiveHabitsForUserAtTime,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { userId: group.userId as any, startTime: group.localTime }
      );
    } catch (groupErr) {
      // One bad userId should not kill all groups
      console.error(
        `[FCM] Failed to fetch habits for userId=${group.userId}:`,
        groupErr
      );
      continue;
    }

    if (habits.length === 0) continue;

    // Collect stale token IDs to bulk-delete after the inner loop
    const staleTokenIds: Id<"pushTokens">[] = [];

    for (const habit of habits) {
      for (let i = 0; i < group.tokens.length; i++) {
        const fcmToken = group.tokens[i];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pushTokenId = group.tokenIds[i] as Id<"pushTokens">;
        const date = group.localDate;
        const timeSlot = group.localTime;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const habitId = habit._id as Id<"habits">;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = group.userId as Id<"users">;

        // ── Idempotency check ──────────────────────────────────────────────
        const alreadyHandled: boolean = await ctx.runQuery(
          internal.reminderLog.wasReminderSent,
          { habitId, date, timeSlot, pushTokenId }
        );

        if (alreadyHandled) {
          if (dryRun) {
            console.log(
              `[FCM dryRun] SKIP (already handled) habit="${habit.title}" date=${date} slot=${timeSlot} token=${fcmToken.slice(0, 12)}…`
            );
          }
          continue;
        }

        // ── Dry-run: log intent, don't write anything ──────────────────────
        if (dryRun) {
          console.log(
            `[FCM dryRun] WOULD SEND habit="${habit.title}" date=${date} slot=${timeSlot} token=${fcmToken.slice(0, 12)}…`
          );
          continue;
        }

        // ── Mock mode: record as sent without hitting FCM ──────────────────
        if (mockMode) {
          console.log(
            `[FCM mockMode] mock-sent habit="${habit.title}" date=${date} slot=${timeSlot}`
          );
          await ctx.runMutation(internal.reminderLog.recordReminder, {
            habitId,
            userId,
            date,
            timeSlot,
            pushTokenId,
            outcome: "sent",
          });
          continue;
        }

        // ── Real FCM send — isolated so one failure doesn't kill the run ───
        try {
          const valid = await sendFCMMessage(
            projectId,
            accessToken,
            fcmToken,
            "Habit Reminder",
            `Time for your habit: ${habit.title}`
          );

          if (!valid) {
            staleTokenIds.push(pushTokenId);
            await ctx.runMutation(internal.reminderLog.recordReminder, {
              habitId,
              userId,
              date,
              timeSlot,
              pushTokenId,
              outcome: "stale_token",
            });
          } else {
            await ctx.runMutation(internal.reminderLog.recordReminder, {
              habitId,
              userId,
              date,
              timeSlot,
              pushTokenId,
              outcome: "sent",
            });
          }
        } catch (sendErr) {
          // Network blip — log, record error outcome, keep going
          console.error(
            `[FCM] sendFCMMessage threw for habit="${habit.title}" token=${fcmToken.slice(0, 12)}…:`,
            sendErr
          );
          await ctx.runMutation(internal.reminderLog.recordReminder, {
            habitId,
            userId,
            date,
            timeSlot,
            pushTokenId,
            outcome: "error",
          });
        }
      }
    }

    // Bulk-delete all stale tokens collected during this group's sends
    if (staleTokenIds.length > 0) {
      await ctx.runMutation(internal.pushTokens.deleteStaleTokens, {
        tokenIds: staleTokenIds,
      });
    }
  }
}

// ============================================
// INTERNAL ACTION — called by the cron every minute
// ============================================

/**
 * Scans all registered push tokens, finds habits whose startTime matches
 * "right now" in each token's timezone, and fires FCM notifications.
 *
 * Stale tokens (FCM returns UNREGISTERED) are bulk-deleted automatically.
 * Each send is guarded by an idempotency check so a double cron tick
 * never produces duplicate notifications.
 *
 * Required Convex environment variables:
 *   FIREBASE_PROJECT_ID   — Firebase project ID
 *   FIREBASE_CLIENT_EMAIL — Service-account client email
 *   FIREBASE_PRIVATE_KEY  — Service-account private key (\\n escaped)
 */
export const sendHabitReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    return withSentry("notifications.sendHabitReminders", "action", ctx, async () => {
      await runReminderScan(ctx);
    });
  },
});

// ============================================
// DEV-ONLY MANUAL TRIGGER (public action)
// ============================================

/**
 * Manually invoke the reminder scan in development for testing.
 * Throws if NODE_ENV === "production" so this cannot be called on prod.
 *
 * Options:
 *   dryRun   — log what WOULD be sent, skip FCM and reminderLog writes
 *   mockMode — skip FCM, but DO write reminderLog (test idempotency safely)
 */
export const triggerRemindersNow = internalAction({
  args: {
    dryRun: v.optional(v.boolean()),
    mockMode: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (process.env.ALLOW_DEV_TRIGGERS !== "true") {
      throw new Error(
        "triggerRemindersNow: dev triggers are disabled in this Convex deployment"
      );
    }
    const opts: ScanOpts = {
      dryRun: args.dryRun ?? false,
      mockMode: args.mockMode ?? false,
    };
    console.log("[FCM manual trigger]", opts);
    await runReminderScan(ctx, opts);
    return { ok: true, opts };
  },
});

/**
 * Public action wrapper for the /admin/reminders page.
 * Gated by ALLOW_DEV_TRIGGERS=true in Convex env vars — set this only in
 * your dev/staging Convex deployment, never in production.
 */
export const devTriggerReminders = action({
  args: {
    dryRun: v.optional(v.boolean()),
    mockMode: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (process.env.ALLOW_DEV_TRIGGERS !== "true") {
      throw new Error(
        "devTriggerReminders: dev triggers are disabled in this Convex deployment"
      );
    }
    const opts: ScanOpts = {
      dryRun: args.dryRun ?? false,
      mockMode: args.mockMode ?? false,
    };
    console.log("[FCM dev trigger]", opts);
    await runReminderScan(ctx, opts);
    return { ok: true, opts };
  },
});
