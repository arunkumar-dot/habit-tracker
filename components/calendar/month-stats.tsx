"use client";

import { useMemo } from "react";
import { toDateString } from "@/lib/date-utils";
import type { HabitCompletion, Habit } from "@/types";

interface MonthStatsProps {
  year: number;
  month: number; // 0-indexed
  habits: Habit[];
  completions: HabitCompletion[];
  todayStr: string;
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 22,
          fontWeight: 500,
          color: "var(--text-primary)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function MonthStats({
  year,
  month,
  habits,
  completions,
  todayStr,
}: MonthStatsProps) {
  const stats = useMemo(() => {
    const monthStartDate = toDateString(new Date(year, month, 1));
    const monthEndDate = toDateString(new Date(year, month + 1, 0));

    // For past months use the full month; for current month use days elapsed
    const isPastMonth = monthEndDate < todayStr;
    const lastRelevantDate = isPastMonth ? monthEndDate : todayStr;

    // Build sorted list of days from month start to lastRelevantDate
    const days: string[] = [];
    let cursor = monthStartDate;
    while (cursor <= lastRelevantDate) {
      days.push(cursor);
      const d = new Date(cursor + "T00:00:00");
      d.setDate(d.getDate() + 1);
      cursor = toDateString(d);
    }

    if (days.length === 0) {
      return { activeDays: "—", activeDaysTotal: "—", completionRate: "—", longestStreak: "—" };
    }

    // Index completions by date
    const completionsByDate = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!completionsByDate.has(c.date)) completionsByDate.set(c.date, new Set());
      completionsByDate.get(c.date)!.add(c.habitId);
    }

    let totalPossible = 0;
    let totalCompleted = 0;
    let activeDayCount = 0;

    // Streak tracking
    let longestStreak = 0;
    let currentStreak = 0;

    for (const day of days) {
      // Habits that existed on this day
      const activeHabitsOnDay = habits.filter(
        (h) =>
          h.frequency === "daily" &&
          toDateString(new Date(h._creationTime)) <= day
      );
      if (activeHabitsOnDay.length === 0) continue;

      const completedIds = completionsByDate.get(day) ?? new Set();
      const completedForDay = activeHabitsOnDay.filter((h) =>
        completedIds.has(h._id)
      ).length;

      totalPossible += activeHabitsOnDay.length;
      totalCompleted += completedForDay;

      const hasAnyCompletion = completedForDay > 0;
      if (hasAnyCompletion) {
        activeDayCount++;
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    const daysWithHabits = days.filter((day) =>
      habits.some(
        (h) =>
          h.frequency === "daily" &&
          toDateString(new Date(h._creationTime)) <= day
      )
    ).length;

    const completionRate =
      totalPossible > 0
        ? `${Math.round((totalCompleted / totalPossible) * 100)}%`
        : "—";

    return {
      activeDays: activeDayCount > 0 ? String(activeDayCount) : "—",
      activeDaysTotal: daysWithHabits > 0 ? String(daysWithHabits) : "—",
      completionRate,
      longestStreak: longestStreak > 0 ? String(longestStreak) : "—",
    };
  }, [year, month, habits, completions, todayStr]);

  const activeDaysValue =
    stats.activeDays === "—" && stats.activeDaysTotal === "—"
      ? "—"
      : `${stats.activeDays} / ${stats.activeDaysTotal}`;

  return (
    <div
      data-testid="month-stats"
      className="rounded-lg p-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-secondary)",
          margin: "0 0 12px",
        }}
      >
        This month
      </p>
      <div className="flex gap-6 flex-wrap">
        <StatItem label="Active days" value={activeDaysValue} />
        <StatItem label="Completion rate" value={stats.completionRate} />
        <StatItem label="Longest streak" value={stats.longestStreak === "—" ? "—" : `${stats.longestStreak}d`} />
      </div>
    </div>
  );
}
