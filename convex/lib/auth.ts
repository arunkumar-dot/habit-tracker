import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

/**
 * Resolves the authenticated user's Convex record.
 * In a MutationCtx: if the user record doesn't exist yet, it auto-provisions it from
 * the authenticated Clerk JWT identity so operations never fail due to signup/onboarding race conditions.
 * In a QueryCtx: throws if unauthenticated or user not yet created.
 */
export async function getAuthUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users">> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthenticated");

  let user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!user && "insert" in ctx.db) {
    const now = Date.now();
    const userId = await (ctx as MutationCtx).db.insert("users", {
      clerkId: identity.subject,
      name: identity.name ?? identity.nickname ?? "Anonymous",
      firstName: identity.givenName,
      lastName: identity.familyName,
      email: identity.email ?? "",
      imageUrl: identity.pictureUrl,
      createdAt: now,
      updatedAt: now,
    });
    user = await ctx.db.get(userId);
  }

  if (!user) throw new Error("User not found. Please reload the page.");
  return user;
}

/**
 * Safe query helper that returns null instead of throwing if the user record
 * doesn't exist yet in the database.
 */
export async function getOptionalAuthUser(
  ctx: QueryCtx
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}
