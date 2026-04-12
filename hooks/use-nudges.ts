"use client";

import { useState } from "react";
import { useHabits } from "./use-habits";
import { useCompletionsForDate, useCompletionsForDateRange } from "./use-completions";
import { today, addDays } from "@/lib/date-utils";
import { generateNudges, type Nudge } from "@/lib/nudges";

/**
 * Generates up to 2 contextual nudges per session based on habit behaviour.
 * Uses a 14-day completion window to approximate per-habit streaks without
 * needing one hook call per habit (which would violate React hooks rules).
 *
 * Dismissed nudges are hidden for the remainder of the session (not persisted).
 */
export function useNudges(): { nudges: Nudge[]; dismiss: (id: string) => void } {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const { habits } = useHabits();
  const todayStr = today();
  const yesterdayStr = addDays(todayStr, -1);
  const twoWeeksAgo = addDays(todayStr, -14);

  const { completedHabitIds: todayCompletedIds } = useCompletionsForDate(todayStr);
  const { completedHabitIds: yesterdayCompletedIds } = useCompletionsForDate(yesterdayStr);
  const { completions: recentCompletions } = useCompletionsForDateRange(twoWeeksAgo, todayStr);

  // Derive per-habit streak lengths from the 14-day window.
  // Sufficient for detecting 6-day streaks and milestone multiples of 5.
  const streaks: Record<string, { currentStreak: number }> = {};
  if (habits && recentCompletions) {
    // Build a set of completed dates per habit
    const habitDates: Record<string, Set<string>> = {};
    for (const c of recentCompletions) {
      const hId = c.habitId as string;
      if (!habitDates[hId]) habitDates[hId] = new Set();
      habitDates[hId].add(c.date);
    }

    for (const habit of habits) {
      const hId = habit._id as string;
      const dates = habitDates[hId] ?? new Set<string>();
      // Count consecutive days backwards from today
      let streak = 0;
      let checkDate = todayStr;
      for (let i = 0; i <= 14; i++) {
        if (dates.has(checkDate)) {
          streak++;
          checkDate = addDays(checkDate, -1);
        } else {
          break;
        }
      }
      streaks[hId] = { currentStreak: streak };
    }
  }

  const rawNudges =
    habits && recentCompletions !== undefined
      ? generateNudges({
          habits,
          streaks,
          completedTodayIds: todayCompletedIds,
          completedYesterdayIds: yesterdayCompletedIds,
          currentHour: new Date().getHours(),
        })
      : [];

  const nudges = rawNudges.filter((n) => !dismissed.has(n.id));

  function dismiss(id: string) {
    setDismissed((prev) => new Set([...prev, id]));
  }

  return { nudges, dismiss };
}
