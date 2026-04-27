import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { withSentry } from "./lib/sentry";

// ============================================
// INTERNAL HELPER
// ============================================

async function getAuthUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user) throw new Error("User not found. Please reload the page.");
  return user;
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all completions for the current user on a specific date.
 * Used on the dashboard and timeline to show today's completion status.
 */
export const getCompletionsForDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query("habitCompletions")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", user._id).eq("date", args.date)
      )
      .collect();
  },
});

/**
 * Get all completions for a specific habit (used for streak calculation and calendar).
 * Optionally filter by date range.
 */
export const getCompletionsForHabit = query({
  args: {
    habitId: v.id("habits"),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Verify habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new Error("Habit not found or access denied.");
    }

    const completionsQuery = ctx.db
      .query("habitCompletions")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId));

    const completions = await completionsQuery.collect();

    // Filter by date range if provided
    return completions.filter((c) => {
      if (args.startDate && c.date < args.startDate) return false;
      if (args.endDate && c.date > args.endDate) return false;
      return true;
    });
  },
});

/**
 * Get all completions for the current user within a date range.
 * Used by the calendar and analytics views.
 */
export const getCompletionsForDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const completions = await ctx.db
      .query("habitCompletions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return completions.filter(
      (c) => c.date >= args.startDate && c.date <= args.endDate
    );
  },
});

/**
 * Check if a specific habit is completed on a specific date.
 */
export const isHabitCompletedOnDate = query({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Verify habit ownership
    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) return false;

    const completion = await ctx.db
      .query("habitCompletions")
      .withIndex("by_habit_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    return completion !== null;
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Toggle habit completion for a given date.
 * If no completion exists → creates one (marks complete).
 * If completion exists → deletes it (marks incomplete).
 * Returns { action, newMilestones } where newMilestones contains daysRequired
 * values for any milestones just unlocked (used for achievement toasts).
 */
export const toggleCompletion = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return withSentry("completions.toggleCompletion", "mutation", ctx, async () => {
      const user = await getAuthUser(ctx);

      // Verify habit ownership
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== user._id) {
        throw new Error("Habit not found or access denied.");
      }

      // Check if already completed
      const existing = await ctx.db
        .query("habitCompletions")
        .withIndex("by_habit_date", (q) =>
          q.eq("habitId", args.habitId).eq("date", args.date)
        )
        .unique();

      if (existing) {
        // Remove completion (mark incomplete)
        await ctx.db.delete(existing._id);
        return { action: "uncompleted" as const, newMilestones: [] as number[] };
      } else {
        // Add completion (mark complete)
        await ctx.db.insert("habitCompletions", {
          habitId: args.habitId,
          userId: user._id,
          date: args.date,
          completedAt: Date.now(),
        });

        // Check for newly unlocked milestones
        const newMilestones: number[] = await ctx.runMutation(
          internal.milestones.checkAndAwardMilestones,
          { habitId: args.habitId, userId: user._id }
        );

        return { action: "completed" as const, newMilestones };
      }
    });
  },
});

/**
 * Mark a habit as complete on a given date.
 * Throws if already completed (use toggleCompletion for idempotent behavior).
 */
export const markComplete = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new Error("Habit not found or access denied.");
    }

    // Prevent duplicates
    const existing = await ctx.db
      .query("habitCompletions")
      .withIndex("by_habit_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    if (existing) {
      throw new Error("Habit already completed for this date.");
    }

    return await ctx.db.insert("habitCompletions", {
      habitId: args.habitId,
      userId: user._id,
      date: args.date,
      completedAt: Date.now(),
    });
  },
});

/**
 * Aggregate completion counts per day for the heatmap view.
 * Returns [{ date, count }] sorted ascending — one entry per day that has ≥1 completion.
 * Days with zero completions are omitted (the component fills them as empty).
 */
export const getHeatmapStats = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const completions = await ctx.db
      .query("habitCompletions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const countByDate = new Map<string, number>();
    for (const c of completions) {
      if (c.date >= args.startDate && c.date <= args.endDate) {
        countByDate.set(c.date, (countByDate.get(c.date) ?? 0) + 1);
      }
    }

    return Array.from(countByDate.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([date, count]) => ({ date, count }));
  },
});

/**
 * Mark a habit as incomplete on a given date (remove completion record).
 */
export const markIncomplete = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new Error("Habit not found or access denied.");
    }

    const existing = await ctx.db
      .query("habitCompletions")
      .withIndex("by_habit_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
