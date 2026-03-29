"use client";

import { useCompletionsForHabit } from "./use-completions";
import { calculateStreak, type StreakResult } from "@/lib/streak-utils";
import { today } from "@/lib/date-utils";
import type { HabitId } from "@/types";

/**
 * Calculates streak statistics for a given habit.
 * Computation is done client-side from fetched completion dates.
 */
export function useStreak(
  habitId: HabitId | undefined,
  frequency: "daily" | "weekly" = "daily"
): StreakResult & { isLoading: boolean } {
  const { completedDates, isLoading } = useCompletionsForHabit(habitId);

  if (isLoading || !habitId) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      lastCompletedDate: null,
      isLoading: isLoading || !habitId,
    };
  }

  const result = calculateStreak(completedDates, frequency, today());

  return { ...result, isLoading: false };
}
