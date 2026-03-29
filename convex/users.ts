import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the current authenticated user's Convex record.
 * Returns null if the user hasn't been synced yet.
 */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

/**
 * Upsert (create or update) a user record from Clerk JWT claims.
 * Called on every dashboard load to keep the Convex user in sync with Clerk.
 */
export const upsertUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) {
      // Update name, email, and imageUrl in case they changed in Clerk
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    // Create new user record
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });

    return userId;
  },
});
