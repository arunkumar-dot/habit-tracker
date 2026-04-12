"use client";

import { useCompletionsForHabit } from "./use-completions";
import { today, getWeekStart, addDays } from "@/lib/date-utils";
import type { HabitId } from "@/types";

/**
 * Returns the number of times a habit has been completed in the current
 * ISO week (Monday–Sunday), alongside the habit's weekly goal target.
 *
 * Returns zeros and isLoading=false immediately when weeklyGoal is unset,
 * so callers can conditionally render the progress bar without a loading state.
 */
export function useWeeklyGoal(
  habitId: HabitId | undefined,
  weeklyGoal: number | undefined
): {
  completedThisWeek: number;
  weeklyGoal: number;
  isLoading: boolean;
} {
  const todayStr = today();
  const weekStart = getWeekStart(todayStr);
  const weekEnd = addDays(weekStart, 6);

  // Skip the query entirely when there's no goal set
  const { completedDates, isLoading } = useCompletionsForHabit(
    weeklyGoal ? habitId : undefined,
    weekStart,
    weekEnd
  );

  if (!weeklyGoal) {
    return { completedThisWeek: 0, weeklyGoal: 0, isLoading: false };
  }

  return {
    completedThisWeek: completedDates.length,
    weeklyGoal,
    isLoading,
  };
}
