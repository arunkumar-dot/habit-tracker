"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { DashboardContentSkeleton } from "@/components/ui/skeleton";
import { StreakSummary } from "@/components/analytics/streak-summary";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate, useCompletionsForDateRange } from "@/hooks/use-completions";
import { today, addDays } from "@/lib/date-utils";
import { DailyCheckInModal } from "@/components/retention/daily-check-in-modal";
import { StreakThread } from "@/components/StreakThread";
import type { StreakDay } from "@/components/StreakThread";
import type { WeeklyData } from "@/types";

// Lazy-load Recharts to avoid SSR issues
const WeeklyChart = dynamic(
  () => import("@/components/analytics/weekly-chart").then((m) => m.WeeklyChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[200px] rounded-lg animate-pulse"
        style={{ background: "var(--bg-sunken)" }}
      />
    ),
  }
);

// ── Completion ring ──────────────────────────────────────────────────────────

function CompletionRing({ pct, size = 84 }: { pct: number; size?: number }) {
  const r = (size - 10) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(pct, 100) / 100);
  const isDone = pct >= 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={5} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={isDone ? "var(--success)" : "var(--accent)"}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 400ms ease" }}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: size * 0.19,
          fontWeight: 500,
          fill: isDone ? "var(--success)" : "var(--text-secondary)",
        }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();

  const selectedDate = today();
  const { habits } = useHabits();
  const { completedHabitIds } = useCompletionsForDate(selectedDate);

  // Weekly slice for micro-stats + chart
  const sevenDaysAgo = addDays(selectedDate, -6);
  const { completions: weekCompletions } = useCompletionsForDateRange(
    sevenDaysAgo,
    selectedDate
  );

  // Today's numbers
  const totalCount = habits?.length ?? 0;
  const completedCount =
    habits?.filter((h) => completedHabitIds.has(h._id)).length ?? 0;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const heroMessage = allDone
    ? "All done — great work!"
    : completedCount === 0
    ? "Ready to start?"
    : completedCount >= Math.ceil(totalCount / 2)
    ? "More than halfway there"
    : "Keep going";

  // Per-day breakdown for chart + aggregate stats
  const dailyHabits = useMemo(
    () => habits?.filter((h) => h.frequency === "daily") ?? [],
    [habits]
  );

  const weeklyData = useMemo<WeeklyData[]>(() => {
    if (!weekCompletions || !habits) return [];
    return Array.from({ length: 7 }, (_, idx) => {
      const dateStr = addDays(selectedDate, -(6 - idx));
      const completedOnDay = new Set(
        weekCompletions.filter((c) => c.date === dateStr).map((c) => c.habitId)
      );
      const date = new Date(dateStr + "T00:00:00");
      return {
        date: dateStr,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        completed: completedOnDay.size,
        total: dailyHabits.length,
        rate:
          dailyHabits.length > 0
            ? Math.round((completedOnDay.size / dailyHabits.length) * 100)
            : 0,
      };
    });
  }, [weekCompletions, habits, dailyHabits, selectedDate]);

  const weeklyStats = useMemo(() => {
    if (weeklyData.length === 0) return { thisWeek: 0, avgRate: 0 };
    return {
      thisWeek: weeklyData.reduce((s, d) => s + d.completed, 0),
      avgRate: Math.round(
        weeklyData.reduce((s, d) => s + d.rate, 0) / weeklyData.length
      ),
    };
  }, [weeklyData]);

  // Derive real StreakDay[] from weeklyData
  const weekDays = useMemo<StreakDay[]>(() => {
    return weeklyData.map((d) => {
      if (d.date === selectedDate) return { date: d.date, status: "today" };
      return {
        date: d.date,
        status: d.completed > 0 ? "completed" : "missed",
        color: "var(--accent)",
      };
    });
  }, [weeklyData, selectedDate]);

  // ⛔ Wait for Clerk to initialize (must be after all hooks)
  if (!isLoaded) return <DashboardContentSkeleton />;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <>
      <DailyCheckInModal />

      {/* ── Hero card ─────────────────────────────────────────────────────── */}
      <Card variant="default" padding="lg" className="mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="type-meta-label mb-2" style={{ color: "var(--text-tertiary)" }}>
              Today
            </p>
            <div className="flex items-baseline gap-2 leading-none">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 64,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: allDone ? "var(--success)" : "var(--text-primary)",
                }}
              >
                {completedCount}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: "var(--text-tertiary)",
                }}
              >
                / {totalCount}
              </span>
            </div>
            <p className="text-sm mt-3" style={{ color: "var(--text-secondary)" }}>
              {totalCount === 0 ? "No habits yet" : heroMessage}
            </p>
          </div>

          {totalCount > 0 && <CompletionRing pct={progressPct} size={84} />}
        </div>
      </Card>

      {/* ── Micro-stats strip ─────────────────────────────────────────────── */}
      {totalCount > 0 && (
        <div
          className="grid grid-cols-3 mb-6"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {(
            [
              { value: totalCount, label: "Active" },
              { value: weeklyStats.thisWeek, label: "This week" },
              { value: `${weeklyStats.avgRate}%`, label: "Avg rate" },
            ] as { value: string | number; label: string }[]
          ).map(({ value, label }, i) => (
            <div
              key={label}
              className="py-4 text-center"
              style={i < 2 ? { borderRight: "1px solid var(--border-subtle)" } : undefined}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 34,
                  fontWeight: 400,
                  lineHeight: 1,
                  color: "var(--text-primary)",
                }}
              >
                {value}
              </p>
              <p className="type-meta-label mt-1" style={{ color: "var(--text-tertiary)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── 7-day streak thread ───────────────────────────────────────────── */}
      {weekDays.length === 7 && (
        <div className="mb-7">
          <StreakThread variant="week" days={weekDays} />
        </div>
      )}

      {/* ── Weekly bar chart ──────────────────────────────────────────────── */}
      {totalCount > 0 && (
        <div className="mb-6">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            This week
          </h2>
          <Card variant="default" padding="md">
            <WeeklyChart data={weeklyData} />
          </Card>
        </div>
      )}

      {/* ── Streak leaderboard ───────────────────────────────────────────── */}
      {totalCount > 0 && (
        <div className="mb-6">
          <StreakSummary />
        </div>
      )}
    </>
  );
}
