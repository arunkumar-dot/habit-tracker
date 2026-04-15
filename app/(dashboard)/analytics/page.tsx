"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { StreakSummary } from "@/components/analytics/streak-summary";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { today, addDays, formatDateLabel } from "@/lib/date-utils";
import type { WeeklyData } from "@/types";

// Lazy-load Recharts to prevent SSR issues
const WeeklyChart = dynamic(
  () => import("@/components/analytics/weekly-chart").then((m) => m.WeeklyChart),
  { ssr: false, loading: () => <div className="h-[200px] animate-shimmer rounded-xl" /> }
);

export default function AnalyticsPage() {
  const { habits } = useHabits();

  // Last 7 days
  const todayStr = today();
  const sevenDaysAgo = addDays(todayStr, -6);
  const { completions } = useCompletionsForDateRange(sevenDaysAgo, todayStr);

  const dailyHabits = habits?.filter((h) => h.frequency === "daily") ?? [];
  const totalHabits = habits?.length ?? 0;

  // Build weekly chart data
  const weeklyData: WeeklyData[] = useMemo(() => {
    const days: WeeklyData[] = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = addDays(todayStr, -i);
      const completedOnDay = new Set(
        completions?.filter((c) => c.date === dateStr).map((c) => c.habitId) ?? []
      );
      const date = new Date(dateStr + "T00:00:00");
      days.push({
        date: dateStr,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: completedOnDay.size,
        total: dailyHabits.length,
        rate:
          dailyHabits.length > 0
            ? Math.round((completedOnDay.size / dailyHabits.length) * 100)
            : 0,
      });
    }
    return days;
  }, [completions, dailyHabits, todayStr]);

  const isStatsLoading = !habits || !completions;

  const totalCompletionsThisWeek = weeklyData.reduce(
    (sum, d) => sum + d.completed,
    0
  );
  const avgCompletionRate =
    weeklyData.length > 0
      ? Math.round(
          weeklyData.reduce((sum, d) => sum + d.rate, 0) / weeklyData.length
        )
      : 0;

  return (
    <>
      <PageHeader title="Analytics" description="Your habit performance over time" />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {isStatsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <div className="col-span-2 sm:col-span-1">
              <StatCardSkeleton />
            </div>
          </>
        ) : (
          <>
            <Card variant="default" padding="md">
              <p className="type-hero-number" style={{ color: "var(--text-primary)" }}>
                {totalHabits}
              </p>
              <p className="type-meta-label mt-2" style={{ color: "var(--text-tertiary)" }}>
                Active Habits
              </p>
            </Card>
            <Card variant="default" padding="md">
              <p className="type-hero-number" style={{ color: "var(--text-primary)" }}>
                {totalCompletionsThisWeek}
              </p>
              <p className="type-meta-label mt-2" style={{ color: "var(--text-tertiary)" }}>
                This Week
              </p>
            </Card>
            <Card variant="default" padding="md" className="col-span-2 sm:col-span-1">
              <p className="type-hero-number" style={{ color: "var(--text-primary)" }}>
                {avgCompletionRate}%
              </p>
              <p className="type-meta-label mt-2" style={{ color: "var(--text-tertiary)" }}>
                Avg Completion
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Weekly chart */}
      <Card variant="default" padding="md" className="mb-6">
        <CardHeader>
          <CardTitle>Completions (Last 7 Days)</CardTitle>
        </CardHeader>
        <WeeklyChart data={weeklyData} />
      </Card>

      {/* Streak summary */}
      <StreakSummary />
    </>
  );
}
