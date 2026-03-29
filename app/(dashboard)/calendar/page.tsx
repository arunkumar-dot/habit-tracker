"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HabitCalendar } from "@/components/calendar/habit-calendar";
import { HabitList } from "@/components/habits/habit-list";
import { EditHabitDialog } from "@/components/habits/habit-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
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

      <div
        className="rounded-2xl p-5 mb-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-xl transition-colors hover:bg-[color:var(--bg-hover)]" style={{ color: "var(--text-secondary)" }}>
            <ChevronLeft size={18} />
          </button>
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {monthLabel}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-xl transition-colors hover:bg-[color:var(--bg-hover)]" style={{ color: "var(--text-secondary)" }}>
            <ChevronRight size={18} />
          </button>
        </div>

        <HabitCalendar
          year={year}
          month={month}
          habits={habits ?? []}
          completions={completions ?? []}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          todayStr={today()}
        />
      </div>

      {/* Habits for selected date */}
      <div>
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

      <EditHabitDialog habit={editingHabit} onClose={() => setEditingHabit(null)} />
    </>
  );
}
