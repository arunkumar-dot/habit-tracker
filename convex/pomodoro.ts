import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUser, getOptionalAuthUser } from "./lib/auth";

// ============================================
// MUTATIONS
// ============================================

/**
 * Record a completed Pomodoro session.
 */
export const saveSession = mutation({
  args: {
    habitId: v.optional(v.id("habits")),
    mode: v.union(
      v.literal("focus"),
      v.literal("shortBreak"),
      v.literal("longBreak")
    ),
    durationSecs: v.number(),
    date: v.string(), // "YYYY-MM-DD"
    completedAt: v.number(), // Unix ms
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    await ctx.db.insert("pomodoroSessions", {
      userId: user._id,
      habitId: args.habitId,
      mode: args.mode,
      durationSecs: args.durationSecs,
      date: args.date,
      completedAt: args.completedAt,
    });
  },
});

// ============================================
// QUERIES
// ============================================

/**
 * Get all Pomodoro sessions for the current user on a specific date.
 * Used for the daily stats row on the Pomodoro page.
 */
export const listSessionsForDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query("pomodoroSessions")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .collect();
  },
});
