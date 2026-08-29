import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUser, getOptionalAuthUser } from "./lib/auth";

// ============================================
// QUERIES
// ============================================

/**
 * Get the daily check-in record for the current user on a specific date.
 * Returns null if no check-in has been recorded yet for that date.
 */
export const getDailyCheckIn = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query("dailyCheckIns")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .unique();
  },
});

/**
 * Get recent check-in records from startDate onward.
 * Used by streak freeze logic to find skipped days.
 */
export const getRecentCheckIns = query({
  args: { startDate: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const checkIns = await ctx.db
      .query("dailyCheckIns")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Filter to requested date range in JS (no Convex .filter() used)
    return checkIns.filter((c) => c.date >= args.startDate);
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Insert or update today's check-in record.
 * Safe to call multiple times — acts as an upsert.
 */
export const upsertDailyCheckIn = mutation({
  args: {
    date: v.string(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const existing = await ctx.db
      .query("dailyCheckIns")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { completed: args.completed });
    } else {
      await ctx.db.insert("dailyCheckIns", {
        userId: user._id,
        date: args.date,
        completed: args.completed,
        createdAt: Date.now(),
      });
    }
  },
});
