"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { HabitCompletion, HabitId } from "@/types";

/**
 * Subscribe to all completions for the current user on a specific date.
 * Returns a set of completed habitIds for O(1) lookup.
 * Skips the query until Convex has received and validated the auth token.
 */
export function useCompletionsForDate(date: string): {
  completions: HabitCompletion[] | undefined;
  completedHabitIds: Set<string>;
  isLoading: boolean;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const raw = useQuery(
    api.completions.getCompletionsForDate,
    !authLoading && isAuthenticated ? { date } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;
  const isLoading = authLoading || (isAuthenticated && completions === undefined);

  const completedHabitIds = new Set<string>(
    completions?.map((c: HabitCompletion) => c.habitId as string) ?? []
  );

  return { completions, completedHabitIds, isLoading };
}

/**
 * Subscribe to all completions for a specific habit (for streak calculation).
 */
export function useCompletionsForHabit(
  habitId: HabitId | undefined,
  startDate?: string,
  endDate?: string
): {
  completions: HabitCompletion[] | undefined;
  completedDates: string[];
  isLoading: boolean;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const raw = useQuery(
    api.completions.getCompletionsForHabit,
    !authLoading && isAuthenticated && habitId ? { habitId, startDate, endDate } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;
  const isLoading = authLoading || (isAuthenticated && habitId !== undefined && completions === undefined);
  const completedDates = completions?.map((c: HabitCompletion) => c.date) ?? [];

  return { completions, completedDates, isLoading };
}

/**
 * Subscribe to all completions within a date range (for calendar/analytics).
 */
export function useCompletionsForDateRange(
  startDate: string,
  endDate: string
): {
  completions: HabitCompletion[] | undefined;
  isLoading: boolean;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const raw = useQuery(
    api.completions.getCompletionsForDateRange,
    !authLoading && isAuthenticated ? { startDate, endDate } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;
  return { completions, isLoading: authLoading || (isAuthenticated && completions === undefined) };
}
