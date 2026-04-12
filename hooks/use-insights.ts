"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import {
  getOverallCompletionRate,
  getBestDay,
  getWorstDay,
  getMostConsistentHabit,
  getMostMissedHabit,
  getCompletionRateForHabit,
  getDayOfWeekStats,
  generateBehaviourInsights,
  generateRecommendations,
} from "@/lib/insights";
import type { InsightResult, DayStats } from "@/lib/insights";

export type InsightsMetrics = {
  overallRate: number;
  bestDay: DayStats | null;
  worstDay: DayStats | null;
  mostConsistentTitle: string | null;
  mostConsistentRate: number;
  mostMissedTitle: string | null;
  mostMissedRate: number;
  totalFocusMinutes: number;
  focusSessionCount: number;
  dayOfWeekStats: DayStats[];
};

export type UseInsightsReturn = {
  metrics: InsightsMetrics | null;
  insights: InsightResult[];
  recommendations: InsightResult[];
  completionStats: { date: string; completed: number; total: number }[] | undefined;
  isLoading: boolean;
};

/**
 * Fetches raw data from Convex and computes all insight metrics client-side.
 * Subscribes to both 7-day and 30-day results upfront so window toggle is instant.
 */
export function useInsights(window: 7 | 30 = 30): UseInsightsReturn {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const skip = authLoading || !isAuthenticated;

  // Subscribe to both windows upfront — switching is instant
  const stats7 = useQuery(
    api.insights.getCompletionStats,
    skip ? "skip" : { days: 7 }
  );
  const stats30 = useQuery(
    api.insights.getCompletionStats,
    skip ? "skip" : { days: 30 }
  );
  const habitStats7 = useQuery(
    api.insights.getHabitCompletionStats,
    skip ? "skip" : { days: 7 }
  );
  const habitStats30 = useQuery(
    api.insights.getHabitCompletionStats,
    skip ? "skip" : { days: 30 }
  );
  const pomodoroStats = useQuery(
    api.insights.getPomodoroStats,
    skip ? "skip" : {}
  );

  const completionStats = window === 7 ? stats7 : stats30;
  const habitStats = window === 7 ? habitStats7 : habitStats30;

  const isLoading =
    authLoading ||
    (isAuthenticated &&
      (completionStats === undefined ||
        habitStats === undefined ||
        pomodoroStats === undefined));

  const metrics = useMemo<InsightsMetrics | null>(() => {
    if (!completionStats || !habitStats || !pomodoroStats) return null;

    const consistent = getMostConsistentHabit(habitStats);
    const missed = getMostMissedHabit(habitStats);

    return {
      overallRate: getOverallCompletionRate(completionStats),
      bestDay: getBestDay(completionStats),
      worstDay: getWorstDay(completionStats),
      mostConsistentTitle: consistent?.title ?? null,
      mostConsistentRate: consistent ? getCompletionRateForHabit(consistent) : 0,
      mostMissedTitle: missed?.title ?? null,
      mostMissedRate: missed ? getCompletionRateForHabit(missed) : 0,
      totalFocusMinutes: pomodoroStats.totalMinutes,
      focusSessionCount: pomodoroStats.sessionCount,
      dayOfWeekStats: getDayOfWeekStats(completionStats),
    };
  }, [completionStats, habitStats, pomodoroStats]);

  const insights = useMemo<InsightResult[]>(() => {
    if (!completionStats || !habitStats) return [];
    return generateBehaviourInsights({
      completionRows: completionStats,
      habitRows: habitStats,
    });
  }, [completionStats, habitStats]);

  const recommendations = useMemo<InsightResult[]>(() => {
    if (!completionStats || !habitStats) return [];
    return generateRecommendations({
      completionRows: completionStats,
      habitRows: habitStats,
    });
  }, [completionStats, habitStats]);

  return { metrics, insights, recommendations, completionStats, isLoading };
}
