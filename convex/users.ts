import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";

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
 * Get the current authenticated user's Convex record.
 * Also resolves a custom profile image URL from Convex storage if one has been uploaded.
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

    if (!user) return null;

    // Resolve custom uploaded profile image, falling back to Clerk imageUrl
    let resolvedImageUrl: string | null = null;
    if (user.profileImageStorageId) {
      resolvedImageUrl = await ctx.storage.getUrl(user.profileImageStorageId);
    }
    if (!resolvedImageUrl) {
      resolvedImageUrl = user.imageUrl ?? null;
    }

    return { ...user, resolvedImageUrl };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Upsert (create or update) a user record from Clerk JWT claims.
 * Called on every dashboard load to keep the Convex user in sync with Clerk.
 *
 * On CREATE: sets name, email, imageUrl from Clerk.
 * On UPDATE: only syncs email and imageUrl — preserves any name the user set on their profile.
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
      // Update email and imageUrl only — do NOT overwrite user-edited name
      await ctx.db.patch(existing._id, {
        email: args.email,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    // Create new user record (name from Clerk on first creation)
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

/**
 * Update the current user's app-specific profile fields.
 * Only the authenticated user can update their own profile.
 */
export const updateProfile = mutation({
  args: {
    name: v.string(),
    age: v.optional(v.number()),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    await ctx.db.patch(user._id, {
      name: args.name,
      age: args.age,
      sex: args.sex,
      location: args.location,
      bio: args.bio,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Generate a short-lived signed upload URL for Convex file storage.
 * The client POSTs the image bytes directly to this URL, then calls saveProfileImage.
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Just need to be authenticated — no user record lookup required for URL generation
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save the storageId of a newly uploaded profile image to the user's record.
 */
export const saveProfileImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    await ctx.db.patch(user._id, {
      profileImageStorageId: args.storageId,
      updatedAt: Date.now(),
    });
  },
});
