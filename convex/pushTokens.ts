import { mutation, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";

// ============================================
// INTERNAL HELPER
// ============================================

async function getAuthUser(ctx: MutationCtx | QueryCtx) {
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
// PUBLIC MUTATIONS
// ============================================

/**
 * Store or refresh an FCM token for the current user's device.
 * De-duplicates by token string — if the token already exists for this user,
 * the row is left untouched. If it belongs to a different user (e.g. shared
 * device), the old row is deleted and a fresh one is inserted.
 */
export const upsertToken = mutation({
  args: {
    token: v.string(),
    timezone: v.string(), // IANA timezone e.g. "America/New_York"
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Check if this exact token already exists
    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (existing) {
      if (existing.userId === user._id) {
        // Already registered for this user — nothing to do
        return existing._id;
      }
      // Token was registered to a different user (device reassigned) — replace it
      await ctx.db.delete(existing._id);
    }

    return await ctx.db.insert("pushTokens", {
      userId: user._id,
      token: args.token,
      timezone: args.timezone,
      createdAt: Date.now(),
    });
  },
});

/**
 * Remove a specific FCM token for the current user (e.g. when they disable
 * push notifications or sign out on this device).
 */
export const deleteToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const existing = await ctx.db
      .query("pushTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (existing && existing.userId === user._id) {
      await ctx.db.delete(existing._id);
    }
  },
});

/**
 * Remove ALL FCM tokens for the current user (e.g. global sign-out or
 * "disable on all devices").
 */
export const deleteAllTokensForUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const tokens = await ctx.db
      .query("pushTokens")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const t of tokens) {
      await ctx.db.delete(t._id);
    }
  },
});

// ============================================
// INTERNAL QUERIES  (used by the cron action)
// ============================================

/**
 * Returns all FCM tokens with their timezones.
 * Used by the cron notification action to determine which users to notify.
 */
export const getAllTokensWithTimezones = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pushTokens").collect();
  },
});

/**
 * Deletes a single push token document by its Convex ID.
 * Called internally when FCM reports a token as stale/unregistered.
 */
export const deleteStaleToken = internalMutation({
  args: { tokenId: v.id("pushTokens") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tokenId);
  },
});

/**
 * Bulk-deletes multiple stale push tokens in a single Convex mutation.
 * Prefer this over looping deleteStaleToken to avoid serializing many round-trips.
 */
export const deleteStaleTokens = internalMutation({
  args: { tokenIds: v.array(v.id("pushTokens")) },
  handler: async (ctx, args) => {
    for (const tokenId of args.tokenIds) {
      await ctx.db.delete(tokenId);
    }
  },
});

/**
 * Returns habits for a specific user that match the given startTime string
 * and are not archived. Used by the cron to find habits due right now.
 */
export const getActiveHabitsForUserAtTime = internalQuery({
  args: {
    userId: v.id("users"),
    startTime: v.string(), // "HH:MM"
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("habits")
      .withIndex("by_user_start_time", (q) =>
        q.eq("userId", args.userId).eq("startTime", args.startTime)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
  },
});
