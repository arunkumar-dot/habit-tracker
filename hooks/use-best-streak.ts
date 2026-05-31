"use client";

import { useMemo } from "react";
import { useHabits } from "./use-habits";
import { useCompletionsForDateRange } from "./use-completions";
import { calculateStreak } from "@/lib/streak-utils";
import { today, addDays } from "@/lib/date-utils";

/**
 * Returns the highest current streak across all active habits.
 * Uses two Convex subscriptions: habits list + a 100-day completion range.
 * Avoids N+1 per-habit subscriptions.
 */
export function useBestStreak(): { bestStreak: number; isLoading: boolean } {
  const { habits, isLoading: habitsLoading } = useHabits();
  const startDate = addDays(today(), -100);
  const { completions, isLoading: completionsLoading } = useCompletionsForDateRange(
    startDate,
    today()
  );

  const bestStreak = useMemo(() => {
    if (!habits || !completions) return 0;
    let max = 0;
    for (const habit of habits) {
      const dates = completions
        .filter((c) => (c.habitId as string) === (habit._id as string))
        .map((c) => c.date);
      const { currentStreak } = calculateStreak(dates, habit.frequency, today());
      if (currentStreak > max) max = currentStreak;
    }
    return max;
  }, [habits, completions]);

  return {
    bestStreak,
    isLoading: habitsLoading || completionsLoading,
  };
}
