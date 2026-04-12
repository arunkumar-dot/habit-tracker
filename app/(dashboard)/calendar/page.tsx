"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HabitCalendar } from "@/components/calendar/habit-calendar";
import { HabitList } from "@/components/habits/habit-list";
import { EditHabitDialog } from "@/components/habits/habit-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { CalendarGridSkeleton } from "@/components/ui/skeleton";
import { today, toDateString, addDays } from "@/lib/date-utils";
import type { Habit } from "@/types";

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { habits, isLoading: habitsLoading } = useHabits();

  // Get completions for entire month (plus padding)
  const monthStart = toDateString(new Date(year, month, 1));
  const monthEnd = toDateString(new Date(year, month + 1, 0));
  const { completions, isLoading: completionsLoading } = useCompletionsForDateRange(monthStart, monthEnd);

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    const now = new Date();
    if (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth())) return;
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
  }

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Calendar"
        description="View your habit completion history"
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Calendar — fixed width so cells stay compact */}
        <div
          className="w-full lg:w-80 shrink-0 rounded-2xl p-4"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg transition-colors hover:bg-[color:var(--bg-hover)]" style={{ color: "var(--text-secondary)" }}>
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {monthLabel}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg transition-colors hover:bg-[color:var(--bg-hover)]" style={{ color: "var(--text-secondary)" }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {habitsLoading || completionsLoading ? (
            <CalendarGridSkeleton />
          ) : (
            <HabitCalendar
              year={year}
              month={month}
              habits={habits ?? []}
              completions={completions ?? []}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              todayStr={today()}
            />
          )}
        </div>

        {/* Habits for selected date */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            Habits for {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </h3>
          <HabitList
            habits={habits}
            date={selectedDate}
            isLoading={habitsLoading}
            onEdit={setEditingHabit}
            onAddNew={() => {}}
          />
        </div>
      </div>

      <EditHabitDialog habit={editingHabit} onClose={() => setEditingHabit(null)} />
    </>
  );
}
