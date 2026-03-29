"use client";

import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import type { User } from "@/types";

/**
 * Returns the current user's Convex record and loading state.
 * Also triggers upsertUser to keep the record in sync with Clerk.
 *
 * Skips all Convex queries until Clerk has fully loaded and the
 * user is confirmed signed-in, preventing "Unauthenticated" errors.
 */
export function useCurrentUser(): { user: User | null | undefined; isLoading: boolean } {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  // Only fire the Convex query once Clerk has confirmed the user is signed in.
  const isSignedIn = clerkLoaded && !!clerkUser;
  const convexUser = useQuery(
    api.users.getCurrentUser,
    isSignedIn ? {} : "skip"
  );

  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (!clerkLoaded || !clerkUser) return;

    // Sync Clerk user data into Convex
    upsertUser({
      name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: clerkUser.imageUrl,
    }).catch(console.error);
  }, [clerkLoaded, clerkUser, upsertUser]);

  const isLoading = !clerkLoaded || (isSignedIn && convexUser === undefined);

  return { user: convexUser, isLoading };
}
