import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Insert a single reminder-log entry.
 * Called after every FCM send attempt (success, stale token, or error).
 */
export const recordReminder = internalMutation({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(),
    timeSlot: v.string(),
    pushTokenId: v.id("pushTokens"),
    outcome: v.union(
      v.literal("sent"),
      v.literal("stale_token"),
      v.literal("error")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reminderLog", {
      habitId: args.habitId,
      userId: args.userId,
      date: args.date,
      timeSlot: args.timeSlot,
      pushTokenId: args.pushTokenId,
      sentAt: Date.now(),
      outcome: args.outcome,
    });
  },
});

/**
 * Returns true if a reminder has already been sent (or definitively handled —
 * "sent" or "stale_token") for this exact (habitId, date, timeSlot, pushTokenId)
 * tuple. "error" outcomes are NOT counted as handled so they can be retried.
 */
export const wasReminderSent = internalQuery({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
    timeSlot: v.string(),
    pushTokenId: v.id("pushTokens"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reminderLog")
      .withIndex("by_habit_date_slot_token", (q) =>
        q
          .eq("habitId", args.habitId)
          .eq("date", args.date)
          .eq("timeSlot", args.timeSlot)
          .eq("pushTokenId", args.pushTokenId)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("outcome"), "sent"),
          q.eq(q.field("outcome"), "stale_token")
        )
      )
      .first();

    return existing !== null;
  },
});

/**
 * Returns the 20 most recent reminderLog entries for display in the admin page.
 * Public query — gated by NODE_ENV on the calling page; no auth check needed
 * since this route is dev-only (returns notFound() in production).
 */
export const getRecentLogs = query({
  args: {},
  handler: async (ctx) => {
    // Collect descending by _creationTime (system field, always indexed)
    const rows = await ctx.db
      .query("reminderLog")
      .order("desc")
      .take(20);
    return rows;
  },
});

/**
 * Deletes reminderLog rows older than 7 days.
 * Runs nightly via a cron so the table doesn't grow unbounded.
 */
export const cleanupOldReminderLogs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - 7);

    // Format as "YYYY-MM-DD" to compare against stored date strings
    const cutoffDate = cutoff.toISOString().slice(0, 10);

    // Collect rows whose date is strictly before the cutoff date string.
    // String comparison works because the date format is lexicographically ordered.
    const stale = await ctx.db
      .query("reminderLog")
      .withIndex("by_date")
      .filter((q) => q.lt(q.field("date"), cutoffDate))
      .collect();

    for (const row of stale) {
      await ctx.db.delete(row._id);
    }

    console.log(`[reminderLog] cleaned up ${stale.length} entries older than ${cutoffDate}`);
  },
});
