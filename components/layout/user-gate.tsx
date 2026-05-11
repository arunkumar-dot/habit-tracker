"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/ui/spinner";

/**
 * Holds children until the Convex user record exists.
 *
 * After signup there is a brief window where Clerk auth is valid but
 * upsertUser hasn't completed yet, so getCurrentUser returns null.
 * Queries like listHabits call getAuthUser() and throw "User not found"
 * if children mount during this window. Gating here prevents that crash.
 */
export function UserGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const { isAuthenticated } = useConvexAuth();

  // Authenticated but user not yet written to Convex — upsertUser is in-flight
  if (isLoading || (isAuthenticated && user === null)) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
