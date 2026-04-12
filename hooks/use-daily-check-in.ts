"use client";

import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { today } from "@/lib/date-utils";

/**
 * Manages the daily check-in for the current user.
 *
 * - checkIn === undefined  → still loading
 * - checkIn === null       → no check-in recorded today (show the modal)
 * - checkIn.completed      → user confirmed habits done
 * - !checkIn.completed     → user skipped today
 */
export function useDailyCheckIn() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const todayStr = today();

  const checkIn = useQuery(
    api.checkIns.getDailyCheckIn,
    !authLoading && isAuthenticated ? { date: todayStr } : "skip"
  );

  const upsertCheckInMutation = useMutation(api.checkIns.upsertDailyCheckIn);

  // Loading: auth not ready OR authenticated but query not yet resolved
  const isLoading = authLoading || (isAuthenticated && checkIn === undefined);

  async function submitCheckIn(completed: boolean) {
    await upsertCheckInMutation({ date: todayStr, completed });
  }

  return {
    // undefined while loading; null if no record today; doc if already answered
    checkIn: isLoading ? undefined : (checkIn ?? null),
    isLoading,
    submitCheckIn,
  };
}
