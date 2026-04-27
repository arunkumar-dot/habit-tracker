import type { Habit } from "@/types";
import { formatDisplayTime } from "./time-utils";

export interface Nudge {
  id: string;
  message: string;
  habitId?: string;
}

interface GenerateNudgesParams {
  habits: Habit[];
  /** Per-habit streak counts derived from recent completion history */
  streaks: Record<string, { currentStreak: number }>;
  completedTodayIds: Set<string>;
  completedYesterdayIds: Set<string>;
  /** Current hour (0–23) for time-based nudges */
  currentHour: number;
}

/**
 * Pure function — generates up to 2 contextual nudges based on user behaviour.
 * No React or Convex dependencies; takes pre-fetched data.
 *
 * Priority order:
 * 1. Streak-close nudge   — 1 day away from 7-day streak
 * 2. Time-based nudge     — habit startTime is within 1h of now, not yet done
 * 3. Missed-yesterday     — daily habit not done yesterday or today
 * 4. Streak milestone     — completed today and streak is a multiple of 5
 */
export function generateNudges({
  habits,
  streaks,
  completedTodayIds,
  completedYesterdayIds,
  currentHour,
}: GenerateNudgesParams): Nudge[] {
  const nudges: Nudge[] = [];

  for (const habit of habits) {
    if (nudges.length >= 2) break;

    const habitId = habit._id as string;
    const isCompletedToday = completedTodayIds.has(habitId);
    const isCompletedYesterday = completedYesterdayIds.has(habitId);
    const currentStreak = streaks[habitId]?.currentStreak ?? 0;

    // Rule 1: One away from 7-day streak
    if (currentStreak === 6 && !isCompletedToday) {
      nudges.push({
        id: `streak-close-${habitId}`,
        message: `You're 1 day away from a 7-day streak on "${habit.title}" 🔥`,
        habitId,
      });
      continue;
    }

    // Rule 2: Habit startTime is close to current time and not yet done
    if (habit.startTime && !isCompletedToday) {
      const habitHour = parseInt(habit.startTime.split(":")[0] ?? "0", 10);
      if (Math.abs(currentHour - habitHour) <= 1) {
        nudges.push({
          id: `time-based-${habitId}`,
          message: `You usually complete "${habit.title}" around ${formatDisplayTime(habit.startTime)} — don't miss today`,
          habitId,
        });
        continue;
      }
    }

    // Rule 3: Daily habit missed yesterday, not yet done today
    if (habit.frequency === "daily" && !isCompletedYesterday && !isCompletedToday) {
      nudges.push({
        id: `missed-yesterday-${habitId}`,
        message: `You missed "${habit.title}" yesterday — try again today`,
        habitId,
      });
      continue;
    }

    // Rule 4: Active streak that's a multiple of 5 (celebrate the milestone)
    if (currentStreak > 0 && currentStreak % 5 === 0 && isCompletedToday) {
      nudges.push({
        id: `streak-milestone-${habitId}-${currentStreak}`,
        message: `You're on a ${currentStreak}-day streak for "${habit.title}"! Keep it up 🔥`,
        habitId,
      });
      continue;
    }
  }

  return nudges;
}
