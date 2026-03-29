"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { HabitCompletion, HabitId } from "@/types";

/**
 * Subscribe to all completions for the current user on a specific date.
 * Returns a set of completed habitIds for O(1) lookup.
 * Skips the query until Clerk has authenticated the user.
 */
export function useCompletionsForDate(date: string): {
  completions: HabitCompletion[] | undefined;
  completedHabitIds: Set<string>;
  isLoading: boolean;
} {
  const { isLoaded, isSignedIn } = useAuth();
  const raw = useQuery(
    api.completions.getCompletionsForDate,
    isLoaded && isSignedIn ? { date } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;
  const isLoading = !isLoaded || (!!isSignedIn && completions === undefined);

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
  const { isLoaded, isSignedIn } = useAuth();
  const raw = useQuery(
    api.completions.getCompletionsForHabit,
    isLoaded && isSignedIn && habitId ? { habitId, startDate, endDate } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;
  const isLoading = !isLoaded || (!!isSignedIn && habitId !== undefined && completions === undefined);
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
  const { isLoaded, isSignedIn } = useAuth();
  const raw = useQuery(
    api.completions.getCompletionsForDateRange,
    isLoaded && isSignedIn ? { startDate, endDate } : "skip"
  );
  const completions = raw as HabitCompletion[] | undefined;
  return { completions, isLoading: !isLoaded || (!!isSignedIn && completions === undefined) };
}
