"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { HabitCalendar } from "@/components/calendar/habit-calendar";
import { PageHeader } from "@/components/layout/page-header";
import { Heatmap } from "@/components/Heatmap";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { CalendarGridSkeleton } from "@/components/ui/skeleton";
import { today, toDateString } from "@/lib/date-utils";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);

  const { habits, isLoading: habitsLoading } = useHabits();
  const { isAuthenticated } = useConvexAuth();
  const journalForDate = useQuery(
    api.journal.getByDate,
    isAuthenticated ? { date: selectedDate } : "skip"
  );

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

      {/* ── Month calendar ────────────────────────────────────────────────── */}
      <div
        className="w-full rounded-lg p-4"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-secondary)" }}
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
            onClick={nextMonth}
            className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: "var(--text-secondary)" }}
          >
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

      {/* ── Contribution heatmap ──────────────────────────────────────────── */}
      <div
        className="mt-6 rounded-lg p-4"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h3
          className="mb-4"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Contribution history
        </h3>
        <Heatmap
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          days={365}
        />
      </div>

      {/* ── Journal reflection for selected date ─────────────────────────── */}
      {journalForDate?.entry && (
        <div
          style={{
            borderTop: "1px dashed var(--border)",
            marginTop: 24,
            paddingTop: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <BookOpen size={14} style={{ color: "var(--text-subtle)", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--text-subtle)",
              }}
            >
              Reflection
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}
          >
            {journalForDate.entry.content}
          </p>
        </div>
      )}
    </>
  );
}
