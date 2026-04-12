/**
 * Pure analysis functions for the Intelligence Layer.
 * No React or Convex imports — safe to unit-test in isolation.
 */

// ============================================
// TYPES
// ============================================

export type CompletionRow = {
  date: string;      // "YYYY-MM-DD"
  completed: number; // habits completed that day
  total: number;     // total active habits that day
};

export type HabitRow = {
  habitId: string;
  title: string;
  frequency: string;
  completions: number;
  possibleDays: number;
};

export type DayStats = {
  day: string;  // "Monday", "Tuesday", etc.
  rate: number; // 0–100
};

export type InsightResult = {
  id: string;
  type: "pattern" | "recommendation";
  message: string;
  icon: string;
};

// ============================================
// CONSTANTS
// ============================================

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

// Mon–Sun order for charts
const CHART_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

// ============================================
// METRIC CALCULATORS
// ============================================

/**
 * Overall completion rate across all days and habits in the window.
 */
export function getOverallCompletionRate(rows: CompletionRow[]): number {
  const rowsWithData = rows.filter((r) => r.total > 0);
  if (rowsWithData.length === 0) return 0;
  const total = rowsWithData.reduce((sum, r) => sum + r.total, 0);
  const completed = rowsWithData.reduce((sum, r) => sum + r.completed, 0);
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Day of week with the highest average completion rate.
 */
export function getBestDay(rows: CompletionRow[]): DayStats | null {
  return getExtremeDay(rows, "best");
}

/**
 * Day of week with the lowest average completion rate.
 */
export function getWorstDay(rows: CompletionRow[]): DayStats | null {
  return getExtremeDay(rows, "worst");
}

function getExtremeDay(
  rows: CompletionRow[],
  kind: "best" | "worst"
): DayStats | null {
  const buckets: Record<number, { completed: number; total: number }> = {};

  for (const row of rows) {
    if (row.total === 0) continue;
    const dow = new Date(row.date + "T00:00:00").getDay();
    if (!buckets[dow]) buckets[dow] = { completed: 0, total: 0 };
    buckets[dow]!.completed += row.completed;
    buckets[dow]!.total += row.total;
  }

  const entries = Object.entries(buckets)
    .filter(([, data]) => data.total > 0)
    .map(([dow, data]) => ({
      day: DAY_NAMES[Number(dow)] as string,
      rate: Math.round((data.completed / data.total) * 100),
    }));

  if (entries.length === 0) return null;

  return entries.reduce((acc, cur) =>
    kind === "best"
      ? cur.rate > acc.rate
        ? cur
        : acc
      : cur.rate < acc.rate
        ? cur
        : acc
  );
}

/**
 * Habit with the highest completions / possibleDays ratio.
 */
export function getMostConsistentHabit(habitRows: HabitRow[]): HabitRow | null {
  if (habitRows.length === 0) return null;
  return habitRows.reduce((best, cur) => {
    const bestRate =
      best.possibleDays > 0 ? best.completions / best.possibleDays : 0;
    const curRate =
      cur.possibleDays > 0 ? cur.completions / cur.possibleDays : 0;
    return curRate > bestRate ? cur : best;
  });
}

/**
 * Habit with the lowest completions / possibleDays ratio.
 */
export function getMostMissedHabit(habitRows: HabitRow[]): HabitRow | null {
  if (habitRows.length === 0) return null;
  return habitRows.reduce((worst, cur) => {
    const worstRate =
      worst.possibleDays > 0 ? worst.completions / worst.possibleDays : 0;
    const curRate =
      cur.possibleDays > 0 ? cur.completions / cur.possibleDays : 0;
    return curRate < worstRate ? cur : worst;
  });
}

/**
 * Completion rate % for a single habit row.
 */
export function getCompletionRateForHabit(h: HabitRow): number {
  if (h.possibleDays === 0) return 0;
  return Math.round((h.completions / h.possibleDays) * 100);
}

/**
 * Returns Mon–Sun completion rate stats for use in bar charts.
 */
export function getDayOfWeekStats(rows: CompletionRow[]): DayStats[] {
  const buckets: Record<number, { completed: number; total: number }> = {};
  for (let i = 0; i < 7; i++) {
    buckets[i] = { completed: 0, total: 0 };
  }

  for (const row of rows) {
    if (row.total === 0) continue;
    const dow = new Date(row.date + "T00:00:00").getDay();
    buckets[dow]!.completed += row.completed;
    buckets[dow]!.total += row.total;
  }

  return CHART_DAY_ORDER.map((dow) => ({
    day: (DAY_NAMES[dow] as string).slice(0, 3), // "Mon", "Tue", …
    rate:
      buckets[dow]!.total > 0
        ? Math.round((buckets[dow]!.completed / buckets[dow]!.total) * 100)
        : 0,
  }));
}

// ============================================
// BEHAVIOUR INSIGHTS
// ============================================

export function generateBehaviourInsights(data: {
  completionRows: CompletionRow[];
  habitRows: HabitRow[];
}): InsightResult[] {
  const results: InsightResult[] = [];
  const { completionRows, habitRows } = data;

  if (completionRows.length === 0 && habitRows.length === 0) return [];

  const best = getBestDay(completionRows);
  if (best && best.rate >= 70) {
    results.push({
      id: "best-day",
      type: "pattern",
      icon: "📅",
      message: `You are most consistent on ${best.day}s — ${best.rate}% completion rate`,
    });
  }

  const worst = getWorstDay(completionRows);
  if (worst && worst.rate < 50) {
    results.push({
      id: "worst-day",
      type: "pattern",
      icon: "⚠️",
      message: `You tend to miss habits on ${worst.day}s — only ${worst.rate}% completion`,
    });
  }

  const consistent = getMostConsistentHabit(habitRows);
  if (consistent) {
    const rate = getCompletionRateForHabit(consistent);
    if (rate >= 80) {
      results.push({
        id: "most-consistent",
        type: "pattern",
        icon: "🔥",
        message: `"${consistent.title}" is your most consistent habit at ${rate}%`,
      });
    }
  }

  const overall = getOverallCompletionRate(completionRows);
  if (overall >= 80) {
    results.push({
      id: "high-overall",
      type: "pattern",
      icon: "🌟",
      message: `Great work! Your overall completion rate is ${overall}% this period`,
    });
  }

  return results;
}

// ============================================
// SMART RECOMMENDATIONS
// ============================================

export function generateRecommendations(data: {
  completionRows: CompletionRow[];
  habitRows: HabitRow[];
}): InsightResult[] {
  const results: InsightResult[] = [];
  const { completionRows, habitRows } = data;

  // Per-habit: suggest reducing goal if rate < 50% and enough data
  for (const habit of habitRows) {
    const rate = getCompletionRateForHabit(habit);
    if (rate < 50 && habit.possibleDays >= 7) {
      results.push({
        id: `reduce-goal-${habit.habitId}`,
        type: "recommendation",
        icon: "💡",
        message: `Consider reducing the weekly goal for "${habit.title}" to build consistency (currently ${rate}%)`,
      });
    }
  }

  // Worst day is very low → reschedule
  const worst = getWorstDay(completionRows);
  if (worst && worst.rate < 30) {
    results.push({
      id: "reschedule-worst-day",
      type: "recommendation",
      icon: "📅",
      message: `Try scheduling fewer habits on ${worst.day}s — your completion drops to ${worst.rate}% that day`,
    });
  }

  // Too many habits with low overall rate
  const overall = getOverallCompletionRate(completionRows);
  if (overall < 40 && habitRows.length > 3) {
    results.push({
      id: "fewer-habits",
      type: "recommendation",
      icon: "🎯",
      message: `You have ${habitRows.length} active habits but a ${overall}% completion rate — consider focusing on fewer habits`,
    });
  }

  // Streak rebuilding nudge — no completions last 3 days
  const last3Days = completionRows.slice(-3);
  const recentCompletions = last3Days.reduce((s, r) => s + r.completed, 0);
  if (
    last3Days.length === 3 &&
    recentCompletions === 0 &&
    habitRows.length > 0
  ) {
    results.push({
      id: "rebuild-streak",
      type: "recommendation",
      icon: "⚡",
      message:
        "No completions in the last 3 days — try starting with just one habit today to rebuild momentum",
    });
  }

  return results;
}
