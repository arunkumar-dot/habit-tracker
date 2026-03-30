"use client";

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import type { User } from "@/types";

/**
 * Returns the current user's Convex record and loading state.
 * Also triggers upsertUser to keep the record in sync with Clerk.
 *
 * Skips all Convex calls until Convex has received and validated
 * the auth token, preventing "Unauthenticated" errors.
 */
export function useCurrentUser(): { user: User | null | undefined; isLoading: boolean } {
  const { user: clerkUser } = useUser();
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();

  const convexUser = useQuery(
    api.users.getCurrentUser,
    !authLoading && isAuthenticated ? {} : "skip"
  );

  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !clerkUser) return;

    // Sync Clerk user data into Convex
    upsertUser({
      name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: clerkUser.imageUrl,
    }).catch(console.error);
  }, [authLoading, isAuthenticated, clerkUser, upsertUser]);

  const isLoading = authLoading || (isAuthenticated && convexUser === undefined);

  return { user: convexUser, isLoading };
}
