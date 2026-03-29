"use client";

import { useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { Habit, HabitId } from "@/types";

/**
 * Subscribe to all active habits for the current user, sorted by startTime.
 * Skips the query until Clerk has authenticated the user.
 */
export function useHabits(): { habits: Habit[] | undefined; isLoading: boolean } {
  const { isLoaded, isSignedIn } = useAuth();
  const habits = useQuery(
    api.habits.listHabits,
    isLoaded && isSignedIn ? {} : "skip"
  );
  return { habits, isLoading: !isLoaded || (!!isSignedIn && habits === undefined) };
}

/**
 * Subscribe to a single habit by ID.
 */
export function useHabit(habitId: HabitId | undefined): {
  habit: Habit | null | undefined;
  isLoading: boolean;
} {
  const { isLoaded, isSignedIn } = useAuth();
  const habit = useQuery(
    api.habits.getHabit,
    isLoaded && isSignedIn && habitId ? { habitId } : "skip"
  );
  return { habit, isLoading: !isLoaded || (!!isSignedIn && habitId !== undefined && habit === undefined) };
}

/**
 * Subscribe to habits for the timeline view (sorted by startTime).
 */
export function useTimelineHabits(): {
  habits: Habit[] | undefined;
  isLoading: boolean;
} {
  const { isLoaded, isSignedIn } = useAuth();
  const habits = useQuery(
    api.habits.listHabitsForTimeline,
    isLoaded && isSignedIn ? {} : "skip"
  );
  return { habits, isLoading: !isLoaded || (!!isSignedIn && habits === undefined) };
}
