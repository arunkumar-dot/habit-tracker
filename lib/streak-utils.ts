import { getWeekId, today } from "./date-utils";

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  lastCompletedDate: string | null;
}

/**
 * Calculates current and longest streaks from an array of completion date strings.
 *
 * @param completedDates - Array of "YYYY-MM-DD" strings (may have duplicates, any order)
 * @param frequency - "daily" (consecutive days) or "weekly" (consecutive ISO weeks)
 * @param referenceDate - The "today" reference date (defaults to actual today)
 */
export function calculateStreak(
  completedDates: string[],
  frequency: "daily" | "weekly",
  referenceDate?: string
): StreakResult {
  const ref = referenceDate ?? today();

  // Deduplicate and get unique periods
  const uniquePeriods = getUniquePeriods(completedDates, frequency);

  if (uniquePeriods.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: completedDates.length,
      lastCompletedDate: null,
    };
  }

  // Sort ascending
  const sorted = [...uniquePeriods].sort();

  const longestStreak = calculateLongestStreak(sorted, frequency);
  const currentStreak = calculateCurrentStreak(sorted, frequency, ref);
  const lastCompletedDate =
    completedDates.length > 0
      ? [...completedDates].sort().reverse()[0] ?? null
      : null;

  return {
    currentStreak,
    longestStreak,
    totalCompletions: completedDates.length,
    lastCompletedDate,
  };
}

/**
 * Returns unique period identifiers.
 * For daily: returns the date strings deduplicated.
 * For weekly: returns ISO week IDs like "2025-W12" deduplicated.
 */
function getUniquePeriods(
  dates: string[],
  frequency: "daily" | "weekly"
): string[] {
  if (frequency === "daily") {
    return [...new Set(dates)];
  }
  // Weekly: map each date to its ISO week ID
  const weekIds = dates.map((d) => getWeekId(d));
  return [...new Set(weekIds)];
}

/**
 * Calculates the longest consecutive streak in a sorted array of period IDs.
 */
function calculateLongestStreak(
  sortedPeriods: string[],
  frequency: "daily" | "weekly"
): number {
  if (sortedPeriods.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sortedPeriods.length; i++) {
    const prev = sortedPeriods[i - 1]!;
    const curr = sortedPeriods[i]!;

    if (areConsecutivePeriods(prev, curr, frequency)) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Calculates the current streak (working backwards from today/this week).
 */
function calculateCurrentStreak(
  sortedPeriods: string[],
  frequency: "daily" | "weekly",
  referenceDate: string
): number {
  if (sortedPeriods.length === 0) return 0;

  const refPeriod =
    frequency === "daily" ? referenceDate : getWeekId(referenceDate);
  const prevPeriod = getPreviousPeriod(refPeriod, frequency);

  const lastPeriod = sortedPeriods[sortedPeriods.length - 1]!;

  // Streak is active if last completion is today/this-week OR yesterday/last-week
  if (lastPeriod !== refPeriod && lastPeriod !== prevPeriod) {
    return 0;
  }

  // Walk backwards counting consecutive periods
  let count = 0;
  let expectedPeriod = lastPeriod;

  for (let i = sortedPeriods.length - 1; i >= 0; i--) {
    if (sortedPeriods[i] === expectedPeriod) {
      count++;
      expectedPeriod = getPreviousPeriod(expectedPeriod, frequency);
    } else if ((sortedPeriods[i] ?? "") < expectedPeriod) {
      // Gap — streak broken
      break;
    }
  }

  return count;
}

/**
 * Returns true if `b` immediately follows `a` (no gap between them).
 */
function areConsecutivePeriods(
  a: string,
  b: string,
  frequency: "daily" | "weekly"
): boolean {
  return getPreviousPeriod(b, frequency) === a;
}

/**
 * Returns the period ID immediately before the given period.
 * For daily: previous day "YYYY-MM-DD"
 * For weekly: previous week "YYYY-Www"
 */
function getPreviousPeriod(
  period: string,
  frequency: "daily" | "weekly"
): string {
  if (frequency === "daily") {
    // period is "YYYY-MM-DD"
    const date = new Date(period + "T00:00:00");
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString("en-CA");
  }

  // period is "YYYY-Www" e.g. "2025-W12"
  const match = period.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return period;

  const year = parseInt(match[1]!, 10);
  const week = parseInt(match[2]!, 10);

  if (week === 1) {
    // Go to last week of previous year (ISO week 52 or 53)
    const lastWeekOfPrevYear = getLastISOWeekOfYear(year - 1);
    return `${year - 1}-W${String(lastWeekOfPrevYear).padStart(2, "0")}`;
  }
  return `${year}-W${String(week - 1).padStart(2, "0")}`;
}

/**
 * Returns the last ISO week number of a given year (52 or 53).
 */
function getLastISOWeekOfYear(year: number): number {
  // Dec 28 is always in the last week of the year per ISO 8601
  const dec28 = new Date(Date.UTC(year, 11, 28));
  const dayNum = dec28.getUTCDay() || 7;
  dec28.setUTCDate(dec28.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(dec28.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((dec28.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}
