import { internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

// ============================================================
// TABLES COVERED BY THIS MODULE (keep in sync with schema.ts)
// If you add a new user-owned table to the schema, add it here
// AND update convex/deleteAccount.ts + convex/export.ts.
// ============================================================
// - users
// - habits
// - habitCompletions
// - userMilestones
// - dailyCheckIns
// - pomodoroSessions
// - pushTokens
// - journalEntries
// - reminderLog
// Note: _storage blobs (users.profileImageStorageId) are deleted separately
//       in deleteAccount.ts but are NOT included in the export payload — only
//       the storageId reference is visible through the users row.
// ============================================================

/** Shape returned by collectUserData — typed explicitly to avoid TS circularity. */
export type UserDataBundle = {
  user: Doc<"users"> | null;
  habits: Doc<"habits">[];
  habitCompletions: Doc<"habitCompletions">[];
  userMilestones: Doc<"userMilestones">[];
  dailyCheckIns: Doc<"dailyCheckIns">[];
  pomodoroSessions: Doc<"pomodoroSessions">[];
  pushTokens: Doc<"pushTokens">[];
  journalEntries: Doc<"journalEntries">[];
  reminderLog: Doc<"reminderLog">[];
};

/**
 * Internal helper: look up a Convex user record by Clerk subject ID.
 * Used by the export HTTP action and the deletion action.
 */
export const getUserByClerkId = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

/**
 * Internal query: collect ALL user-owned rows across every table.
 * Used by both the data-export HTTP action and getUserDataSummary.
 *
 * Takes a Convex userId (NOT a Clerk ID) so callers must resolve the
 * user record first via getUserByClerkId. Internal-only — no auth check
 * here because it bypasses per-request scoping by design.
 */
export const collectUserData = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<UserDataBundle> => {
    const { userId } = args;

    const [
      user,
      habits,
      habitCompletions,
      userMilestones,
      dailyCheckIns,
      pomodoroSessions,
      pushTokens,
      journalEntries,
      reminderLog,
    ] = await Promise.all([
      ctx.db.get(userId),
      ctx.db.query("habits").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
      ctx.db.query("habitCompletions").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
      ctx.db.query("userMilestones").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
      ctx.db.query("dailyCheckIns").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
      ctx.db.query("pomodoroSessions").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
      ctx.db.query("pushTokens").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
      // journalEntries has no standalone by_user index — filter by userId via composite index
      ctx.db.query("journalEntries").withIndex("by_user_date", (q) => q.eq("userId", userId)).collect(),
      ctx.db.query("reminderLog").withIndex("by_user", (q) => q.eq("userId", userId)).collect(),
    ]);

    return {
      user,
      habits,
      habitCompletions,
      userMilestones,
      dailyCheckIns,
      pomodoroSessions,
      pushTokens,
      journalEntries,
      reminderLog,
    };
  },
});

/**
 * Public query: return row counts per table for the authenticated user.
 * Powers the deletion confirmation dialog — shows "X habits, Y completions…"
 * before the user commits to deleting their account.
 */
export const getUserDataSummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found. Please reload the page.");

    // Reuse collectUserData to enumerate the same tables as the export and
    // deletion flows — DRY, no drift.
    const data: UserDataBundle = await ctx.runQuery(
      internal.userData.collectUserData,
      { userId: user._id }
    );

    return {
      habits: data.habits.length,
      completions: data.habitCompletions.length,
      journalEntries: data.journalEntries.length,
      milestones: data.userMilestones.length,
      pomodoroSessions: data.pomodoroSessions.length,
      dailyCheckIns: data.dailyCheckIns.length,
      pushTokens: data.pushTokens.length,
      reminderLog: data.reminderLog.length,
    };
  },
});
