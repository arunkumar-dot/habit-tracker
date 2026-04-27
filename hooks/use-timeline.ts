"use client";

import { useState, useEffect } from "react";
import { useTimelineHabits } from "./use-habits";
import { useCompletionsForDate } from "./use-completions";
import {
  computeTimelineGaps,
  getCurrentHabitIndex,
  getUpcomingHabitIndex,
  getCurrentMinutes,
} from "@/lib/time-utils";
import type { TimelineEntry } from "@/types";

/**
 * Builds the interleaved list of habits and gaps for the timeline view.
 * Updates the "current" and "upcoming" habit every minute.
 */
export function useTimeline(date: string): {
  entries: TimelineEntry[];
  currentHabitId: string | null;
  upcomingHabitId: string | null;
  nowMinutes: number;
  isLoading: boolean;
} {
  const { habits, isLoading: habitsLoading } = useTimelineHabits();
  const { completedHabitIds, isLoading: completionsLoading } =
    useCompletionsForDate(date);
  const [nowMinutes, setNowMinutes] = useState(getCurrentMinutes);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMinutes(getCurrentMinutes());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const isLoading = habitsLoading || completionsLoading;

  if (isLoading || !habits) {
    return {
      entries: [],
      currentHabitId: null,
      upcomingHabitId: null,
      nowMinutes,
      isLoading: true,
    };
  }

  // Compute gaps between habits
  const gaps = computeTimelineGaps(habits);
  const currentIdx = getCurrentHabitIndex(habits, nowMinutes);
  const upcomingIdx = getUpcomingHabitIndex(habits, nowMinutes);

  const currentHabitId =
    currentIdx !== null ? habits[currentIdx]?._id ?? null : null;
  const upcomingHabitId =
    upcomingIdx !== null ? habits[upcomingIdx]?._id ?? null : null;

  // Build interleaved entries: habit → gap → habit → gap → ...
  const entries: TimelineEntry[] = [];

  habits.forEach((habit, idx) => {
    const isCompleted = completedHabitIds.has(habit._id);
    const isCurrent = habit._id === currentHabitId;
    const isUpcoming = habit._id === upcomingHabitId;
    const habitEndMinutes = habit.endTime
      ? parseInt(habit.endTime.split(":")[0]!) * 60 +
        parseInt(habit.endTime.split(":")[1]!)
      : parseInt(habit.startTime.split(":")[0]!) * 60 +
        parseInt(habit.startTime.split(":")[1]!) +
        30;
    const isPast = habitEndMinutes < nowMinutes && !isCurrent;

    entries.push({
      type: "habit",
      habit,
      isCompleted,
      isCurrent,
      isUpcoming,
      isPast,
    });

    // Check if there's a gap after this habit
    const gap = gaps.find(
      (g) =>
        g.id === `gap-${habit._id}-${habits[idx + 1]?._id}`
    );
    if (gap) {
      entries.push({
        type: "gap",
        id: gap.id,
        gapMinutes: gap.gapMinutes,
        label: gap.label,
      });
    }
  });

  return { entries, currentHabitId, upcomingHabitId, nowMinutes, isLoading: false };
}
