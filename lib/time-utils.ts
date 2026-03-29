import { parseTimeToMinutes, formatDuration } from "./date-utils";

export interface TimelineGap {
  id: string;
  gapMinutes: number;
  startTime: string;
  endTime: string;
  label: string;
}

export interface TimelineItem {
  type: "habit" | "gap";
  id: string;
}

/**
 * Detects free-time gaps between habits in a sorted list.
 * Only emits gaps >= MIN_GAP_MINUTES.
 *
 * @param habits - Habits with startTime and optional endTime, pre-sorted by startTime
 * @returns Array of TimelineGap objects between habits
 */
export function computeTimelineGaps(
  habits: Array<{
    _id: string;
    startTime: string;
    endTime?: string | null;
  }>,
  MIN_GAP_MINUTES = 30
): TimelineGap[] {
  if (habits.length < 2) return [];

  const gaps: TimelineGap[] = [];

  for (let i = 0; i < habits.length - 1; i++) {
    const current = habits[i]!;
    const next = habits[i + 1]!;

    // End of current habit: use endTime if present, else startTime + 30 min default
    const currentEnd = current.endTime
      ? parseTimeToMinutes(current.endTime)
      : parseTimeToMinutes(current.startTime) + 30;

    const nextStart = parseTimeToMinutes(next.startTime);
    const gapMinutes = nextStart - currentEnd;

    if (gapMinutes >= MIN_GAP_MINUTES) {
      gaps.push({
        id: `gap-${current._id}-${next._id}`,
        gapMinutes,
        startTime: current.endTime ?? minutesToTimeStr(currentEnd),
        endTime: next.startTime,
        label: formatDuration(gapMinutes) + " free",
      });
    }
  }

  return gaps;
}

/**
 * Returns the index of the habit currently active (startTime <= now < endTime).
 * Returns null if no habit is currently active.
 */
export function getCurrentHabitIndex(
  habits: Array<{ startTime: string; endTime?: string | null }>,
  nowMinutes: number
): number | null {
  for (let i = 0; i < habits.length; i++) {
    const habit = habits[i]!;
    const start = parseTimeToMinutes(habit.startTime);
    // Use endTime if present, otherwise treat as 30-minute slot
    const end = habit.endTime
      ? parseTimeToMinutes(habit.endTime)
      : start + 30;

    if (nowMinutes >= start && nowMinutes < end) {
      return i;
    }
  }
  return null;
}

/**
 * Returns the index of the next upcoming habit (startTime > now).
 * Returns null if all habits have already started.
 */
export function getUpcomingHabitIndex(
  habits: Array<{ startTime: string }>,
  nowMinutes: number
): number | null {
  for (let i = 0; i < habits.length; i++) {
    const start = parseTimeToMinutes(habits[i]!.startTime);
    if (start > nowMinutes) {
      return i;
    }
  }
  return null;
}

/**
 * Returns minutes until a habit starts (positive) or since it started (negative).
 */
export function minutesUntil(
  startTime: string,
  nowMinutes: number
): number {
  return parseTimeToMinutes(startTime) - nowMinutes;
}

/**
 * Converts minutes since midnight back to "HH:MM" string.
 */
function minutesToTimeStr(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Sorts habits by startTime ascending.
 */
export function sortHabitsByTime<T extends { startTime: string }>(
  habits: T[]
): T[] {
  return [...habits].sort((a, b) => {
    const aMin = parseTimeToMinutes(a.startTime);
    const bMin = parseTimeToMinutes(b.startTime);
    return aMin - bMin;
  });
}

/**
 * Checks if two habit time ranges overlap.
 */
export function doHabitsOverlap(
  a: { startTime: string; endTime?: string | null },
  b: { startTime: string; endTime?: string | null }
): boolean {
  const aStart = parseTimeToMinutes(a.startTime);
  const aEnd = a.endTime ? parseTimeToMinutes(a.endTime) : aStart + 30;
  const bStart = parseTimeToMinutes(b.startTime);
  const bEnd = b.endTime ? parseTimeToMinutes(b.endTime) : bStart + 30;
  return aStart < bEnd && bStart < aEnd;
}
