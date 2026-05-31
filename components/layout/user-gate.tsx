"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useConvexAuth } from "convex/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { api } from "@/convex/_generated/api";
import { Spinner } from "@/components/ui/spinner";

/**
 * Holds children until the Convex user record exists AND onboarding is done.
 *
 * Two responsibilities:
 * 1. Race-condition guard: Clerk auth is valid but upsertUser hasn't completed
 *    yet so getCurrentUser returns null. Retries upsertUser every 4 s and
 *    shows a reload prompt after 20 s as a last resort.
 * 2. Onboarding gate: redirects to /onboarding when user.onboardingCompleted
 *    is not true, so the user fills in their identity and first habit before
 *    seeing the dashboard.
 */
export function UserGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useCurrentUser();
  const { isAuthenticated } = useConvexAuth();
  const { user: clerkUser } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  // Retry upsert every 4 s while user is null (handles first-signup race)
  useEffect(() => {
    if (isLoading || !isAuthenticated || user !== null || !clerkUser) return;

    const retry = () => {
      upsertUser({
        name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
        firstName: clerkUser.firstName ?? undefined,
        lastName: clerkUser.lastName ?? undefined,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: clerkUser.imageUrl,
      }).catch(console.error);
      setElapsed((e) => e + 4);
    };

    const id = setInterval(retry, 4000);
    return () => clearInterval(id);
  }, [isLoading, isAuthenticated, user, clerkUser, upsertUser]);

  // Redirect to onboarding once user record exists but onboarding isn't done
  useEffect(() => {
    if (isLoading || !user) return;
    if (!user.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [isLoading, user, router]);

  // Still loading or user record not yet written to Convex
  if (isLoading || (isAuthenticated && user === null)) {
    if (elapsed >= 20) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 300,
            gap: 16,
            padding: 24,
          }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: 15, textAlign: "center", margin: 0 }}>
            Taking longer than expected. Check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              minHeight: 48,
              padding: "0 28px",
              borderRadius: 12,
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

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
