import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import { MILESTONES } from "../lib/milestone-config";
import { calculateStreak } from "../lib/streak-utils";

// ============================================
// INTERNAL HELPER
// ============================================

async function getAuthUser(ctx: QueryCtx) {
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
 * Fetch earned milestones for the current user.
 * With habitId: returns milestones for that specific habit.
 * Without habitId: returns all milestones across all habits (global view).
 */
export const getUserMilestones = query({
  args: {
    habitId: v.optional(v.id("habits")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    if (args.habitId) {
      // Verify habit ownership
      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== user._id) {
        throw new Error("Habit not found or access denied.");
      }

      return await ctx.db
        .query("userMilestones")
        .withIndex("by_user_habit", (q) =>
          q.eq("userId", user._id).eq("habitId", args.habitId!)
        )
        .collect();
    }

    return await ctx.db
      .query("userMilestones")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// ============================================
// INTERNAL MUTATIONS
// ============================================

/**
 * Called internally from toggleCompletion after a habit is marked complete.
 * Calculates the current streak and awards any newly crossed milestones.
 * Returns an array of daysRequired values for milestones just unlocked
 * (used by the client to show achievement toasts).
 */
export const checkAndAwardMilestones = internalMutation({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<number[]> => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) return [];

    // Fetch all completion dates for this habit
    const completions = await ctx.db
      .query("habitCompletions")
      .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
      .collect();

    const dates = completions.map((c) => c.date);

    // Calculate current streak (same logic as client-side useStreak)
    const { currentStreak } = calculateStreak(dates, habit.frequency);

    if (currentStreak === 0) return [];

    // Fetch already-earned milestones for this user+habit
    const existing = await ctx.db
      .query("userMilestones")
      .withIndex("by_user_habit", (q) =>
        q.eq("userId", args.userId).eq("habitId", args.habitId)
      )
      .collect();

    const earnedDays = new Set(existing.map((m) => m.daysRequired));
    const now = Date.now();
    const newlyAwarded: number[] = [];

    for (const milestone of MILESTONES) {
      if (
        currentStreak >= milestone.daysRequired &&
        !earnedDays.has(milestone.daysRequired)
      ) {
        await ctx.db.insert("userMilestones", {
          userId: args.userId,
          habitId: args.habitId,
          daysRequired: milestone.daysRequired,
          achievedAt: now,
        });
        newlyAwarded.push(milestone.daysRequired);
      }
    }

    return newlyAwarded;
  },
});
