"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { MonthGrid } from "@/components/calendar/month-grid";
import { DayDetailPanel } from "@/components/calendar/day-detail-panel";
import { MonthStats } from "@/components/calendar/month-stats";
import { CalendarGridSkeleton } from "@/components/ui/skeleton";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { today, toDateString } from "@/lib/date-utils";

export default function CalendarPage() {
  const todayStr = today();
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const { habits, isLoading: habitsLoading } = useHabits();

  const monthStart = toDateString(new Date(year, month, 1));
  const monthEnd = toDateString(new Date(year, month + 1, 0));
  const { completions, isLoading: completionsLoading } = useCompletionsForDateRange(
    monthStart,
    monthEnd
  );

  function prevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    // Reset selected date to 1st of new month
    const newYear = month === 0 ? year - 1 : year;
    const newMonth = month === 0 ? 11 : month - 1;
    setSelectedDate(toDateString(new Date(newYear, newMonth, 1)));
  }

  function nextMonth() {
    const nowDate = new Date();
    if (
      year > nowDate.getFullYear() ||
      (year === nowDate.getFullYear() && month >= nowDate.getMonth())
    )
      return;
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    // Reset selected date to 1st of new month
    const newYear = month === 11 ? year + 1 : year;
    const newMonth = month === 11 ? 0 : month + 1;
    setSelectedDate(toDateString(new Date(newYear, newMonth, 1)));
  }

  const nowDate = new Date();
  const canGoNext =
    year < nowDate.getFullYear() ||
    (year === nowDate.getFullYear() && month < nowDate.getMonth());

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    // If clicking a day in a different month (prev/next padding cells), navigate
    const d = new Date(date + "T00:00:00");
    const clickedYear = d.getFullYear();
    const clickedMonth = d.getMonth();
    if (clickedYear !== year || clickedMonth !== month) {
      setYear(clickedYear);
      setMonth(clickedMonth);
    }
  }

  const isLoading = habitsLoading || completionsLoading;

  return (
    <>
      <PageHeader title="Calendar" />

      {isLoading ? (
        <div
          className="w-full rounded-lg p-4"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
        >
          <CalendarGridSkeleton />
        </div>
      ) : (
        <>
          {/* ── Top section: grid + detail panel side-by-side on md+ ── */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Month grid — 60% on desktop */}
            <div className="md:w-[60%]">
              <MonthGrid
                year={year}
                month={month}
                habits={habits ?? []}
                completions={completions ?? []}
                selectedDate={selectedDate}
                todayStr={todayStr}
                onSelectDate={handleSelectDate}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                canGoNext={canGoNext}
              />
            </div>

            {/* Day detail panel — 40% on desktop */}
            <div className="md:w-[40%]">
              <DayDetailPanel selectedDate={selectedDate} />
            </div>
          </div>

          {/* ── This month stats ── */}
          <div className="mt-4">
            <MonthStats
              year={year}
              month={month}
              habits={habits ?? []}
              completions={completions ?? []}
              todayStr={todayStr}
            />
          </div>
        </>
      )}
    </>
  );
}
