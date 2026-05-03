"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { today } from "@/lib/date-utils";
import {
  parseTimeToMinutes,
  getCurrentMinutes,
  formatDisplayTime,
  sortHabitsByTime,
} from "@/lib/time-utils";
import { CreateHabitDialog } from "@/components/habits/habit-dialog";
import type { HabitId } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(diffMinutes: number): string {
  if (Math.abs(diffMinutes) < 2) return "now";
  if (diffMinutes > 0) {
    if (diffMinutes < 60) return `in ${diffMinutes}m`;
    return `in ${Math.round(diffMinutes / 60)}h`;
  }
  return `${Math.abs(diffMinutes)}m ago`;
}

// ── Compact completion ring ───────────────────────────────────────────────────

function CompletionRing({
  completed,
  total,
  size = 56,
}: {
  completed: number;
  total: number;
  size?: number;
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const r = (size - 8) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(pct, 100) / 100);
  const isDone = completed >= total && total > 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${completed} of ${total} habits completed`}
      style={{ flexShrink: 0 }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={4} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={isDone ? "var(--success)" : "var(--accent)"}
        strokeWidth={4}
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
          fontSize: size * 0.2,
          fontWeight: 500,
          fill: isDone ? "var(--success)" : "var(--text-secondary)",
        }}
      >
        {completed}/{total}
      </text>
    </svg>
  );
}

// ── Isolated sub-component so useOptimisticCompletion is never called conditionally ──

function MarkCompleteButton({ habitId, date }: { habitId: HabitId; date: string }) {
  const { toggle } = useOptimisticCompletion(habitId, date);
  return (
    <Button size="sm" onClick={() => void toggle()}>
      Mark complete
    </Button>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

export function UpNextCard() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const dateStr = today();
  const { completedHabitIds, isLoading: completionsLoading } = useCompletionsForDate(dateStr);
  const [createOpen, setCreateOpen] = useState(false);

  const nowMinutes = getCurrentMinutes();

  const derived = useMemo(() => {
    if (!habits) return { state: "loading" as const, targetHabit: null, completedCount: 0, totalCount: 0 };

    const totalCount = habits.length;
    const completedCount = habits.filter((h) => completedHabitIds.has(h._id)).length;

    if (totalCount === 0) {
      return { state: "empty" as const, targetHabit: null, completedCount: 0, totalCount: 0 };
    }

    if (completedCount === totalCount) {
      // State B — show tomorrow's first habit (sorted by startTime)
      const sorted = sortHabitsByTime(habits);
      return { state: "done" as const, targetHabit: sorted[0] ?? null, completedCount, totalCount };
    }

    const uncompleted = sortHabitsByTime(habits.filter((h) => !completedHabitIds.has(h._id)));

    // State D — after 9 pm, not all done
    if (nowMinutes >= 21 * 60) {
      return { state: "endofday" as const, targetHabit: uncompleted[0] ?? null, completedCount, totalCount };
    }

    // State A — find first uncompleted habit whose startTime >= now
    const upNext = uncompleted.find((h) => parseTimeToMinutes(h.startTime) >= nowMinutes);
    if (upNext) {
      return { state: "upnext" as const, targetHabit: upNext, completedCount, totalCount };
    }

    // State C — all uncompleted habits started in the past; show the earliest
    return { state: "late" as const, targetHabit: uncompleted[0] ?? null, completedCount, totalCount };
  }, [habits, completedHabitIds, nowMinutes]);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (habitsLoading || completionsLoading || derived.state === "loading") {
    return (
      <Card variant="default" padding="lg" className="mb-5" data-testid="up-next-card">
        <div
          className="animate-pulse rounded-md"
          style={{ height: 64, background: "var(--bg-sunken)" }}
        />
      </Card>
    );
  }

  const { state, targetHabit, completedCount, totalCount } = derived;

  // ── State E: No habits ────────────────────────────────────────────────────
  if (state === "empty") {
    return (
      <>
        <Card variant="default" padding="lg" className="mb-5" data-testid="up-next-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="type-meta-label mb-1" style={{ color: "var(--text-tertiary)" }}>
                Welcome
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Create your first habit to get started
              </p>
            </div>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              Create habit
            </Button>
          </div>
        </Card>
        <CreateHabitDialog isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      </>
    );
  }

  // ── State B: All done ─────────────────────────────────────────────────────
  if (state === "done") {
    return (
      <Card variant="default" padding="lg" className="mb-5" data-testid="up-next-card">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-meta-label mb-1" style={{ color: "var(--success)" }}>
              All done today 🎉
            </p>
            {targetHabit && (
              <p className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>
                Tomorrow&apos;s first: {targetHabit.title} at{" "}
                {formatDisplayTime(targetHabit.startTime)}
              </p>
            )}
            <Link
              href="/habits"
              className="text-xs mt-1 inline-block"
              style={{ color: "var(--text-tertiary)", textDecoration: "underline" }}
            >
              View tomorrow
            </Link>
          </div>
          <CompletionRing completed={totalCount} total={totalCount} size={56} />
        </div>
      </Card>
    );
  }

  // ── State D: End of day ───────────────────────────────────────────────────
  if (state === "endofday") {
    return (
      <Card variant="default" padding="lg" className="mb-5" data-testid="up-next-card">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-meta-label mb-1" style={{ color: "var(--text-tertiary)" }}>
              Wrapping up
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {completedCount} of {totalCount} habits complete today
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <CompletionRing completed={completedCount} total={totalCount} size={56} />
            <Link href="/journal">
              <Button size="sm" variant="secondary">
                Reflect
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // ── State A: Up next ──────────────────────────────────────────────────────
  if (state === "upnext" && targetHabit) {
    const diffMinutes = parseTimeToMinutes(targetHabit.startTime) - nowMinutes;
    const color = targetHabit.color ?? "#C2410C";
    return (
      <Card variant="default" padding="lg" className="mb-5" data-testid="up-next-card">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-meta-label mb-1" style={{ color: "var(--text-tertiary)" }}>
              Up next
            </p>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="flex-shrink-0"
                style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
              />
              <p
                className="text-base font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {targetHabit.title}
              </p>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              at {formatDisplayTime(targetHabit.startTime)} · {relativeTime(diffMinutes)}
            </p>
            <div className="mt-3">
              <MarkCompleteButton habitId={targetHabit._id} date={dateStr} />
            </div>
          </div>
          <CompletionRing completed={completedCount} total={totalCount} size={56} />
        </div>
      </Card>
    );
  }

  // ── State C: Late ─────────────────────────────────────────────────────────
  if (state === "late" && targetHabit) {
    const diffMinutes = parseTimeToMinutes(targetHabit.startTime) - nowMinutes; // negative
    const color = targetHabit.color ?? "#C2410C";
    return (
      <Card variant="default" padding="lg" className="mb-5" data-testid="up-next-card">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-meta-label mb-1" style={{ color: "var(--text-tertiary)" }}>
              Behind today
            </p>
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="flex-shrink-0"
                style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
              />
              <p
                className="text-base font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {targetHabit.title}
              </p>
            </div>
            <p
              className="text-xs mt-1"
              style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
            >
              {Math.abs(diffMinutes)} minutes late
            </p>
            <div className="mt-3">
              <MarkCompleteButton habitId={targetHabit._id} date={dateStr} />
            </div>
          </div>
          <CompletionRing completed={completedCount} total={totalCount} size={56} />
        </div>
      </Card>
    );
  }

  return null;
}
