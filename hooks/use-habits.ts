"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Habit, HabitId } from "@/types";

/**
 * Subscribe to all active habits for the current user, sorted by startTime.
 * Skips the query until Convex has received and validated the auth token.
 */
export function useHabits(): { habits: Habit[] | undefined; isLoading: boolean } {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const habits = useQuery(
    api.habits.listHabits,
    !authLoading && isAuthenticated ? {} : "skip"
  );
  return { habits, isLoading: authLoading || (isAuthenticated && habits === undefined) };
}

/**
 * Subscribe to a single habit by ID.
 */
export function useHabit(habitId: HabitId | undefined): {
  habit: Habit | null | undefined;
  isLoading: boolean;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const habit = useQuery(
    api.habits.getHabit,
    !authLoading && isAuthenticated && habitId ? { habitId } : "skip"
  );
  return { habit, isLoading: authLoading || (isAuthenticated && habitId !== undefined && habit === undefined) };
}

/**
 * Subscribe to habits for the timeline view (sorted by startTime).
 */
export function useTimelineHabits(): {
  habits: Habit[] | undefined;
  isLoading: boolean;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const habits = useQuery(
    api.habits.listHabitsForTimeline,
    !authLoading && isAuthenticated ? {} : "skip"
  );
  return { habits, isLoading: authLoading || (isAuthenticated && habits === undefined) };
}
