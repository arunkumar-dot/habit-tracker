import { query } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalAuthUser } from "./lib/auth";

/**
 * Returns per-day completion counts for the last `days` days.
 * Aggregation done server-side — only summary rows sent to client.
 */
export const getCompletionStats = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const user = await getOptionalAuthUser(ctx);
    if (!user) return [];

    const endDate = new Date().toLocaleDateString("en-CA");
    const startDate = (() => {
      const d = new Date();
      d.setDate(d.getDate() - (args.days - 1));
      return d.toLocaleDateString("en-CA");
    })();

    // Active habits count for denominator
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) =>
        q.eq("userId", user._id).eq("isArchived", false)
      )
      .collect();

    // All completions in range via by_user index
    const allCompletions = await ctx.db
      .query("habitCompletions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completionsInRange = allCompletions.filter(
      (c) => c.date >= startDate && c.date <= endDate
    );

    // Group completed count by date
    const byDate: Record<string, number> = {};
    for (const c of completionsInRange) {
      byDate[c.date] = (byDate[c.date] ?? 0) + 1;
    }

    // Build one row per day in the window
    const rows: { date: string; completed: number; total: number }[] = [];
    for (let i = args.days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-CA");
      rows.push({
        date: dateStr,
        completed: byDate[dateStr] ?? 0,
        total: habits.length,
      });
    }

    return rows;
  },
});

/**
 * Returns per-habit completion counts for the last `days` days.
 * Used to identify most consistent and most missed habits.
 */
export const getHabitCompletionStats = query({
  args: { days: v.number() },
  handler: async (ctx, args) => {
    const user = await getOptionalAuthUser(ctx);
    if (!user) return [];

    const endDate = new Date().toLocaleDateString("en-CA");
    const startDate = (() => {
      const d = new Date();
      d.setDate(d.getDate() - (args.days - 1));
      return d.toLocaleDateString("en-CA");
    })();

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) =>
        q.eq("userId", user._id).eq("isArchived", false)
      )
      .collect();

    if (habits.length === 0) return [];

    const allCompletions = await ctx.db
      .query("habitCompletions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completionsInRange = allCompletions.filter(
      (c) => c.date >= startDate && c.date <= endDate
    );

    const countByHabit: Record<string, number> = {};
    for (const c of completionsInRange) {
      const id = c.habitId as string;
      countByHabit[id] = (countByHabit[id] ?? 0) + 1;
    }

    return habits.map((h) => ({
      habitId: h._id as string,
      title: h.title,
      frequency: h.frequency,
      completions: countByHabit[h._id as string] ?? 0,
      possibleDays:
        h.frequency === "daily" ? args.days : Math.ceil(args.days / 7),
    }));
  },
});

/**
 * Returns total focus-mode Pomodoro minutes for the current user (all time).
 */
export const getPomodoroStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalAuthUser(ctx);
    if (!user) {
      return { totalMinutes: 0, sessionCount: 0 };
    }

    const sessions = await ctx.db
      .query("pomodoroSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const focusSessions = sessions.filter((s) => s.mode === "focus");
    const totalSecs = focusSessions.reduce(
      (sum, s) => sum + s.durationSecs,
      0
    );

    return {
      totalMinutes: Math.round(totalSecs / 60),
      sessionCount: focusSessions.length,
    };
  },
});
