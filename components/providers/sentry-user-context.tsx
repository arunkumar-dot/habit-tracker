"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import * as Sentry from "@sentry/nextjs";

/**
 * Sets Sentry user context to the Clerk userId (id only — no email or name).
 * Mount this once inside ClerkProvider in the root layout.
 */
export function SentryUserContext() {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (userId) {
      Sentry.setUser({ id: userId });
    } else {
      Sentry.setUser(null);
    }
  }, [userId, isLoaded]);

  return null;
}
