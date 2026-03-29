"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Invisible component that triggers user sync from Clerk → Convex.
 * Renders nothing; just runs the useCurrentUser hook side effect.
 */
export function UserSync() {
  useCurrentUser();
  return null;
}
