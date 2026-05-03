"use client";

import { useMemo } from "react";
import { CalendarDayCell } from "./calendar-day-cell";
import { addDays, toDateString } from "@/lib/date-utils";
import type { HabitCompletion, Habit } from "@/types";

function ratioToLevel(completed: number, total: number): 0 | 1 | 2 | 3 | 4 {
  if (total === 0) return 0;
  const r = completed / total;
  if (r === 0) return 0;
  if (r <= 0.33) return 1;
  if (r <= 0.66) return 2;
  if (r < 1) return 3;
  return 4;
}

interface HabitCalendarProps {
  year: number;
  month: number; // 0-indexed
  habits: Habit[];
  completions: HabitCompletion[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  todayStr: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HabitCalendar({
  year,
  month,
  habits,
  completions,
  selectedDate,
  onSelectDate,
  todayStr,
}: HabitCalendarProps) {
  // Group completions by date
  const completionsByDate = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of completions) {
      if (!map.has(c.date)) map.set(c.date, new Set());
      map.get(c.date)!.add(c.habitId);
    }
    return map;
  }, [completions]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); // 0 = Sunday
    const days: Array<{ dateStr: string; isCurrentMonth: boolean }> = [];

    // Padding from previous month
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ dateStr: toDateString(d), isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({ dateStr: toDateString(date), isCurrentMonth: true });
    }

    // Padding for next month (fill to 6 rows = 42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ dateStr: toDateString(d), isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const dailyHabits = habits.filter((h) => h.frequency === "daily");
  const totalDailyHabits = dailyHabits.length;

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center py-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            {day[0]}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map(({ dateStr, isCurrentMonth }) => {
          const completedIds = completionsByDate.get(dateStr) ?? new Set();
          const completedCount = completedIds.size;
          const isFuture = dateStr > todayStr;

          return (
            <CalendarDayCell
              key={dateStr}
              dateStr={dateStr}
              isCurrentMonth={isCurrentMonth}
              isToday={dateStr === todayStr}
              isSelected={dateStr === selectedDate}
              isFuture={isFuture}
              saturationLevel={isFuture ? 0 : ratioToLevel(completedCount, totalDailyHabits)}
              onClick={() => { if (!isFuture) onSelectDate(dateStr); }}
            />
          );
        })}
      </div>
    </div>
  );
}
