import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { withSentry } from "./lib/sentry";

// ============================================
// INTERNAL HELPER
// ============================================

/**
 * Resolves the authenticated user's Convex record.
 * Throws if unauthenticated or user record not found.
 */
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
 * Get all active (non-archived) habits for the current user, sorted by startTime.
 */
export const listHabits = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) =>
        q.eq("userId", user._id).eq("isArchived", false)
      )
      .collect();

    // Sort by startTime (HH:MM strings sort correctly lexicographically)
    return habits.sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
});

/**
 * Get a single habit by ID (ownership enforced).
 */
export const getHabit = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(args.habitId);

    if (!habit || habit.userId !== user._id) return null;
    return habit;
  },
});

/**
 * Get all active habits sorted by startTime for the timeline view.
 * Same as listHabits but explicitly named for timeline usage.
 */
export const listHabitsForTimeline = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) =>
        q.eq("userId", user._id).eq("isArchived", false)
      )
      .collect();

    return habits.sort((a, b) => a.startTime.localeCompare(b.startTime));
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Create a new habit.
 */
export const createHabit = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    frequency: v.union(v.literal("daily"), v.literal("weekly")),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    color: v.optional(v.string()),
    weeklyGoal: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return withSentry("habits.createHabit", "mutation", ctx, async () => {
      const user = await getAuthUser(ctx);
      const now = Date.now();

      const habitId = await ctx.db.insert("habits", {
        userId: user._id,
        title: args.title.trim(),
        description: args.description?.trim() || undefined,
        frequency: args.frequency,
        startTime: args.startTime,
        endTime: args.endTime || undefined,
        color: args.color || undefined,
        weeklyGoal: args.weeklyGoal || undefined,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      });

      return habitId;
    });
  },
});

/**
 * Update an existing habit (partial update, ownership enforced).
 */
export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    frequency: v.optional(v.union(v.literal("daily"), v.literal("weekly"))),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    color: v.optional(v.string()),
    weeklyGoal: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return withSentry("habits.updateHabit", "mutation", ctx, async () => {
      const user = await getAuthUser(ctx);
      const { habitId, ...updates } = args;

      const habit = await ctx.db.get(habitId);
      if (!habit || habit.userId !== user._id) {
        throw new Error("Habit not found or access denied.");
      }

      // Build patch object — only include defined fields
      const patch: Record<string, unknown> = { updatedAt: Date.now() };
      if (updates.title !== undefined) patch.title = updates.title.trim();
      if (updates.description !== undefined)
        patch.description = updates.description.trim() || undefined;
      if (updates.frequency !== undefined) patch.frequency = updates.frequency;
      if (updates.startTime !== undefined) patch.startTime = updates.startTime;
      if (updates.endTime !== undefined)
        patch.endTime = updates.endTime || undefined;
      if (updates.color !== undefined) patch.color = updates.color || undefined;
      if (updates.weeklyGoal !== undefined)
        patch.weeklyGoal = updates.weeklyGoal || undefined;

      await ctx.db.patch(habitId, patch);
    });
  },
});

/**
 * Hard-delete a habit and all its completions.
 * For a "safe" delete that preserves history, use archiveHabit instead.
 */
export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    return withSentry("habits.deleteHabit", "mutation", ctx, async () => {
      const user = await getAuthUser(ctx);

      const habit = await ctx.db.get(args.habitId);
      if (!habit || habit.userId !== user._id) {
        throw new Error("Habit not found or access denied.");
      }

      // Delete all completions for this habit
      const completions = await ctx.db
        .query("habitCompletions")
        .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
        .collect();

      await Promise.all(completions.map((c) => ctx.db.delete(c._id)));

      // Delete the habit itself
      await ctx.db.delete(args.habitId);
    });
  },
});

// ============================================
// DEV-ONLY — E2E TEST CLEANUP
// ============================================

/**
 * Bulk-deletes every habit (and its completions) whose title starts with
 * "E2E_" for the currently authenticated user.
 *
 * Safety note: Convex bundles functions with NODE_ENV="production" for ALL
 * deployment types (dev and prod alike), so a NODE_ENV guard always throws.
 * Instead we gate on the "E2E_" prefix itself — no real user will ever have
 * habits named that way — and on Clerk authentication (getAuthUser throws for
 * unauthenticated callers). The mutation is also only callable via the
 * /api/dev/cleanup-test-data route which checks NODE_ENV server-side.
 *
 * Called by /api/dev/cleanup-test-data during Playwright afterEach hooks.
 */
export const deleteTestHabits = mutation({
  args: {},
  handler: async (ctx) => {

    const user = await getAuthUser(ctx);

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user_archived", (q) =>
        q.eq("userId", user._id).eq("isArchived", false)
      )
      .collect();

    const testHabits = habits.filter((h) => h.title.startsWith("E2E_"));

    await Promise.all(
      testHabits.map(async (habit) => {
        // Delete all completions for this habit first
        const completions = await ctx.db
          .query("habitCompletions")
          .withIndex("by_habit", (q) => q.eq("habitId", habit._id))
          .collect();
        await Promise.all(completions.map((c) => ctx.db.delete(c._id)));
        await ctx.db.delete(habit._id);
      })
    );

    return { deleted: testHabits.length };
  },
});

/**
 * Soft-delete a habit (preserves completion history for streak records).
 */
export const archiveHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const habit = await ctx.db.get(args.habitId);
    if (!habit || habit.userId !== user._id) {
      throw new Error("Habit not found or access denied.");
    }

    await ctx.db.patch(args.habitId, {
      isArchived: true,
      updatedAt: Date.now(),
    });
  },
});
