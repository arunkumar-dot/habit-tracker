"use client";

import Link from "next/link";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { useHabits } from "@/hooks/use-habits";
import { toDateString } from "@/lib/date-utils";

interface DayDetailPanelProps {
  selectedDate: string;
}

function formatHeading(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DayDetailPanel({ selectedDate }: DayDetailPanelProps) {
  const { isAuthenticated } = useConvexAuth();

  const { habits } = useHabits();
  const { completedHabitIds } = useCompletionsForDate(selectedDate);

  const journalResult = useQuery(
    api.journal.getByDate,
    isAuthenticated ? { date: selectedDate } : "skip"
  );

  const pomodoroSessions = useQuery(
    api.pomodoro.listSessionsForDate,
    isAuthenticated ? { date: selectedDate } : "skip"
  );

  // Habits that existed on this day (createdAt ≤ selectedDate)
  const activeHabitsOnDay = (habits ?? []).filter(
    (h) => toDateString(new Date(h._creationTime)) <= selectedDate
  );

  const journalEntry = journalResult?.entry ?? null;

  // Focus sessions only (exclude short/long breaks)
  const focusSessions = (pomodoroSessions ?? []).filter(
    (s) => s.mode === "focus"
  );
  const totalFocusMinutes = Math.round(
    focusSessions.reduce((sum, s) => sum + s.durationSecs, 0) / 60
  );

  const hasHabits = activeHabitsOnDay.length > 0;
  const hasJournal = !!journalEntry;
  const hasPomodoro = focusSessions.length > 0;
  const hasAnything = hasHabits || hasJournal || hasPomodoro;

  const journalContent = journalEntry?.content ?? "";
  const journalTruncated = journalContent.length > 200;
  const journalPreview = journalTruncated
    ? journalContent.slice(0, 200) + "…"
    : journalContent;

  return (
    <div
      data-testid="day-detail-panel"
      className="rounded-lg p-4 flex flex-col gap-4"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      {/* Heading */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 500,
          color: "var(--text-primary)",
          margin: 0,
        }}
      >
        {formatHeading(selectedDate)}
      </h3>

      {!hasAnything && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-subtle)",
            margin: 0,
          }}
        >
          Nothing recorded for this day
        </p>
      )}

      {/* ── Habits ── */}
      <section>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-secondary)",
            margin: "0 0 8px",
          }}
        >
          Habits
        </p>

        {!hasHabits ? (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-subtle)",
              margin: 0,
            }}
          >
            No habits tracked yet
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {activeHabitsOnDay.map((habit) => {
              const done = completedHabitIds.has(habit._id);
              return (
                <li
                  key={habit._id}
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                >
                  {/* Color dot */}
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: habit.color ?? "var(--accent)",
                    }}
                  />
                  <span style={{ flex: 1 }}>{habit.title}</span>
                  <span style={{ fontSize: 14 }}>{done ? "✅" : "❌"}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Journal ── */}
      {hasJournal && (
        <section>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-secondary)",
              margin: "0 0 8px",
            }}
          >
            Journal
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              margin: 0,
            }}
          >
            {journalPreview}
          </p>
          {journalTruncated && (
            <Link
              href={`/journal?date=${selectedDate}`}
              style={{
                display: "inline-block",
                marginTop: 6,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--accent)",
                textDecoration: "none",
              }}
            >
              Read more
            </Link>
          )}
        </section>
      )}

      {/* ── Pomodoro ── */}
      {hasPomodoro && (
        <section>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-secondary)",
              margin: "0 0 8px",
            }}
          >
            Focus
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {focusSessions.length} focus session{focusSessions.length !== 1 ? "s" : ""},{" "}
            {totalFocusMinutes} minute{totalFocusMinutes !== 1 ? "s" : ""} total
          </p>
        </section>
      )}
    </div>
  );
}
