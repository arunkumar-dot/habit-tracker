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
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
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
      // Sync email, imageUrl, and name fields from Clerk — do NOT overwrite
      // firstName/lastName if the user has already edited them in settings
      await ctx.db.patch(existing._id, {
        email: args.email,
        imageUrl: args.imageUrl,
        ...(existing.firstName === undefined && args.firstName
          ? { firstName: args.firstName }
          : {}),
        ...(existing.lastName === undefined && args.lastName
          ? { lastName: args.lastName }
          : {}),
      });
      return existing._id;
    }

    // Create new user record with name fields from Clerk
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: args.name,
      firstName: args.firstName,
      lastName: args.lastName,
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
    age: v.optional(v.number()),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    location: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    await ctx.db.patch(user._id, {
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
 * Mark identity onboarding as complete and save the user's identity statement.
 * Called once after the two-screen onboarding flow.
 */
export const completeOnboarding = mutation({
  args: {
    identityStatement: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    await ctx.db.patch(user._id, {
      identityStatement: args.identityStatement.trim(),
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });
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
