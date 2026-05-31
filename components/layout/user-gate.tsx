"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
 *
 * Also redirects to /onboarding if the user has not completed identity
 * onboarding (onboardingCompleted !== true).
 */
export function UserGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    if (!user.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [isLoading, user, router]);

  // Still loading or user record not yet written to Convex
  if (isLoading || (isAuthenticated && user === null)) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect pending — show spinner so there's no flash of dashboard content
  if (user && !user.onboardingCompleted) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
