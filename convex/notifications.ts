import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

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
// TIMEZONE HELPER
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

// ============================================
// INTERNAL ACTION — called by the cron every minute
// ============================================

/**
 * Scans all registered push tokens, finds habits whose startTime matches
 * "right now" in each token's timezone, and fires FCM notifications.
 *
 * Stale tokens (FCM returns UNREGISTERED) are deleted automatically.
 *
 * Required Convex environment variables:
 *   FIREBASE_PROJECT_ID   — Firebase project ID
 *   FIREBASE_CLIENT_EMAIL — Service-account client email
 *   FIREBASE_PRIVATE_KEY  — Service-account private key (\\n escaped)
 */
export const sendHabitReminders = internalAction({
  args: {},
  handler: async (ctx) => {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !rawKey) {
      // Credentials not yet configured — silently skip.
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
    let accessToken: string;
    try {
      accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    } catch (e) {
      console.error("[FCM] Failed to get access token:", e);
      return;
    }

    // 3. Group tokens by userId × localTime to avoid N+1 habit queries
    //    Key: `${userId}::${localTime}`
    const groups = new Map<
      string,
      { userId: string; localTime: string; tokens: string[]; tokenIds: string[] }
    >();

    for (const t of tokens) {
      const localTime = localTimeString(t.timezone);
      const key = `${t.userId}::${localTime}`;

      if (!groups.has(key)) {
        groups.set(key, {
          userId: t.userId,
          localTime,
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
      const habits: Array<{ _id: string; title: string }> = await ctx.runQuery(
        internal.pushTokens.getActiveHabitsForUserAtTime,
        { userId: group.userId as any, startTime: group.localTime }
      );

      if (habits.length === 0) continue;

      // Send one notification per habit × token pair
      for (const habit of habits) {
        for (let i = 0; i < group.tokens.length; i++) {
          const valid = await sendFCMMessage(
            projectId,
            accessToken,
            group.tokens[i],
            "Habit Reminder",
            `Time for your habit: ${habit.title}`
          );

          if (!valid) {
            // Stale token — schedule deletion
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await ctx.runMutation(internal.pushTokens.deleteStaleToken, {
              tokenId: group.tokenIds[i] as any,
            });
          }
        }
      }
    }
  },
});
