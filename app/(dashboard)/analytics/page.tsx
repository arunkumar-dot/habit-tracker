"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, BarChart2, Zap, TrendingUp, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCardSkeleton } from "@/components/ui/skeleton";
import { StreakSummary } from "@/components/analytics/streak-summary";
import { StreakThread } from "@/components/StreakThread";
import { WeeklyChart } from "@/components/analytics/weekly-chart";
import { getMockMonthDays } from "@/lib/streaks";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { today, addDays } from "@/lib/date-utils";
import type { WeeklyData } from "@/types";

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <PageHeader
        title="Analytics & Velocity"
        description="Comprehensive insights into your daily momentum and habit performance."
      />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isStatsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="glass-card glow-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  Active Habits
                </span>
                <CheckCircle size={16} className="text-[var(--accent)]" />
              </div>
              <p className="text-4xl font-normal" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {totalHabits}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                Currently tracked routines
              </p>
            </div>

            <div className="glass-card glow-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  This Week
                </span>
                <Zap size={16} className="text-[var(--warning)]" />
              </div>
              <p className="text-4xl font-normal" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {totalCompletionsThisWeek}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                Completions in the last 7 days
              </p>
            </div>

            <div className="glass-card glow-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  Consistency Rate
                </span>
                <TrendingUp size={16} className="text-[var(--success)]" />
              </div>
              <p className="text-4xl font-normal" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {avgCompletionRate}%
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                Average daily completion
              </p>
            </div>
          </>
        )}
      </div>

      {/* 7-Day Performance Chart */}
      <div className="glass-card rounded-3xl p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={18} className="text-[var(--accent)]" />
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            7-Day Activity Velocity
          </h2>
        </div>
        <WeeklyChart data={weeklyData} />
      </div>

      {/* 30-day streak thread */}
      <div className="glass-card rounded-3xl p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-[var(--accent)]" />
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            30-Day Activity Thread
          </h2>
        </div>
        <StreakThread variant="month" days={getMockMonthDays()} />
      </div>

      {/* Streak summary */}
      <StreakSummary />
    </motion.div>
  );
}
