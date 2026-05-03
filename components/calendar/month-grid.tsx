"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDayCell } from "./calendar-day-cell";
import { addDays, toDateString } from "@/lib/date-utils";
import type { HabitCompletion, Habit } from "@/types";

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed
  habits: Habit[];
  completions: HabitCompletion[];
  selectedDate: string;
  todayStr: string;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  canGoNext: boolean;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;

/**
 * Maps a completion ratio (0–1) to a heatmap saturation level (0–4).
 * Returns 0 when no habits existed on the day.
 */
function ratioToLevel(
  completedCount: number,
  totalHabitsOnDay: number
): 0 | 1 | 2 | 3 | 4 {
  if (totalHabitsOnDay === 0) return 0;
  const ratio = completedCount / totalHabitsOnDay;
  if (ratio === 0) return 0;
  if (ratio <= 0.33) return 1;
  if (ratio <= 0.66) return 2;
  if (ratio < 1) return 3;
  return 4;
}

export function MonthGrid({
  year,
  month,
  habits,
  completions,
  selectedDate,
  todayStr,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  canGoNext,
}: MonthGridProps) {
  // Index completions by date → set of habitIds
  const completionsByDate = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!map.has(c.date)) map.set(c.date, new Set());
      map.get(c.date)!.add(c.habitId);
    }
    return map;
  }, [completions]);

  // Build calendar grid (42 cells: 6 rows × 7 cols)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: Array<{ dateStr: string; isCurrentMonth: boolean }> = [];

    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ dateStr: toDateString(new Date(year, month, -i)), isCurrentMonth: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ dateStr: toDateString(new Date(year, month, d)), isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ dateStr: toDateString(new Date(year, month + 1, i)), isCurrentMonth: false });
    }
    return days;
  }, [year, month]);

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      data-testid="month-grid"
      className="w-full rounded-lg p-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      {/* Header: prev / month label / next */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onPrevMonth}
          className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 400,
            color: "var(--text-primary)",
          }}
        >
          {monthLabel}
        </h2>
        <button
          onClick={onNextMonth}
          disabled={!canGoNext}
          className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-default"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="text-center py-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map(({ dateStr, isCurrentMonth }) => {
          const isFuture = dateStr > todayStr;

          // Count habits that existed on this day (createdAt ≤ dateStr)
          const activeHabitsOnDay = habits.filter(
            (h) =>
              h.frequency === "daily" &&
              toDateString(new Date(h._creationTime)) <= dateStr
          );
          const totalOnDay = activeHabitsOnDay.length;

          // Count completions for habits that existed on that day
          const completedIds = completionsByDate.get(dateStr) ?? new Set();
          const completedCount = activeHabitsOnDay.filter((h) =>
            completedIds.has(h._id)
          ).length;

          const level = isFuture || !isCurrentMonth
            ? 0
            : ratioToLevel(completedCount, totalOnDay);

          return (
            <CalendarDayCell
              key={dateStr}
              dateStr={dateStr}
              isCurrentMonth={isCurrentMonth}
              isToday={dateStr === todayStr}
              isSelected={dateStr === selectedDate}
              isFuture={isFuture}
              saturationLevel={level}
              onClick={() => {
                if (!isFuture) onSelectDate(dateStr);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
