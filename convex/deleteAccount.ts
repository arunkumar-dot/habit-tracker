import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { sendToSentry } from "./lib/sentry";

// ─── Internal deletion mutations ─────────────────────────────────────────────
//
// Each mutation handles one table. They are called in sequence from the
// deleteMyAccount action, keeping individual transactions small.
//
// Deletion order matters — FK constraints flow from:
//   reminderLog → pushTokens, habits
//   habitCompletions, userMilestones → habits
// so child tables must be deleted before parent tables.
//
// Tables covered (mirror convex/userData.ts — keep in sync):
//   reminderLog, pushTokens, pomodoroSessions, dailyCheckIns,
//   journalEntries, userMilestones, habitCompletions, habits, users
// Plus _storage blob for profileImageStorageId.

export const deleteUserReminderLogs = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("reminderLog")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserPushTokens = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("pushTokens")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserPomodoroSessions = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("pomodoroSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserDailyCheckIns = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("dailyCheckIns")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserJournalEntries = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // journalEntries has no standalone by_user index — use the composite index
    const rows = await ctx.db
      .query("journalEntries")
      .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserMilestones = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("userMilestones")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserCompletions = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("habitCompletions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserHabits = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
  },
});

export const deleteUserStorageBlob = internalMutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
  },
});

export const deleteUserRecord = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

// ─── Public action ────────────────────────────────────────────────────────────

/**
 * deleteMyAccount — hard-deletes all data for the authenticated user.
 *
 * Deletion order (child tables before parents to avoid orphaned FKs):
 *  a. reminderLog       (refs habits + pushTokens)
 *  b. pushTokens
 *  c. pomodoroSessions
 *  d. dailyCheckIns
 *  e. journalEntries
 *  f. userMilestones    (refs habits)
 *  g. habitCompletions  (refs habits)
 *  h. habits
 *  i. _storage blob     (if profileImageStorageId is set)
 *  j. users row
 *
 * After Convex data is gone, calls Clerk's user-delete REST API.
 * If the Clerk call fails, the error is logged to Sentry but NOT rethrown.
 * The user's Convex data is already gone; their next sign-in attempt will
 * sync them as a brand-new Convex user row. That is the accepted failure mode.
 *
 * SETUP REQUIRED: set CLERK_SECRET_KEY in Convex environment variables:
 *   npx convex env set CLERK_SECRET_KEY <sk_test_…>
 */
export const deleteMyAccount = action({
  args: {},
  handler: async (ctx) => {
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const clerkId = identity.subject;

    // ── 2. Resolve Convex user ────────────────────────────────────────────────
    const user = await ctx.runQuery(internal.userData.getUserByClerkId, { clerkId });
    if (!user) throw new Error("User not found. Please reload the page.");

    const userId = user._id;
    const storageId = user.profileImageStorageId ?? null;

    // ── 3. Delete all user data in dependency order ───────────────────────────
    await ctx.runMutation(internal.deleteAccount.deleteUserReminderLogs, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserPushTokens, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserPomodoroSessions, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserDailyCheckIns, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserJournalEntries, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserMilestones, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserCompletions, { userId });
    await ctx.runMutation(internal.deleteAccount.deleteUserHabits, { userId });

    if (storageId) {
      await ctx.runMutation(internal.deleteAccount.deleteUserStorageBlob, { storageId });
    }

    await ctx.runMutation(internal.deleteAccount.deleteUserRecord, { userId });

    // ── 4. Delete Clerk user via REST API ─────────────────────────────────────
    // All Convex data is already gone at this point.
    // We call Clerk's admin API using CLERK_SECRET_KEY (set via `npx convex env set`).
    // If this call fails, we log to Sentry and swallow the error. The user's
    // Convex data is already deleted; their Clerk account remaining is an
    // acceptable degraded state — they can delete it manually from Clerk's dashboard.
    try {
      const secretKey = process.env.CLERK_SECRET_KEY;
      if (!secretKey) {
        throw new Error("CLERK_SECRET_KEY is not set in Convex environment variables. Run: npx convex env set CLERK_SECRET_KEY <sk_…>");
      }

      const response = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "(no body)");
        throw new Error(`Clerk DELETE /v1/users/${clerkId} returned ${response.status}: ${body}`);
      }
    } catch (err) {
      // Best-effort Sentry report — do NOT rethrow. The user's Convex data is
      // already deleted. Their Clerk user remaining is a known acceptable state.
      await sendToSentry(err, {
        tags: {
          convex_function: "deleteAccount.deleteMyAccount",
          convex_type: "action",
          step: "clerk_user_delete",
        },
        user: { id: clerkId },
      });
      console.error("[deleteMyAccount] Clerk user deletion failed (Convex data already deleted):", err);
    }

    return { ok: true };
  },
});
