"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/rpg/animated-card";
import { GlowButton } from "@/components/rpg/glow-button";
import { StreakShield } from "@/components/rpg/streak-shield";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { useStreak } from "@/hooks/use-streaks";
import { today } from "@/lib/date-utils";
import { getQuestCodename, QUEST_XP } from "@/lib/rpg-dashboard";
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
    <GlowButton onClick={() => void toggle()} tone="xp" className="w-full md:w-auto">
      Complete mission
    </GlowButton>
  );
}

function ActiveMissionDetails({
  targetHabit,
  date,
  completedCount,
  totalCount,
  timing,
  status,
}: {
  targetHabit: NonNullable<ReturnType<typeof useHabits>["habits"]>[number];
  date: string;
  completedCount: number;
  totalCount: number;
  timing: string;
  status: "upnext" | "late";
}) {
  const color = targetHabit.color ?? "#C2410C";
  const { currentStreak } = useStreak(targetHabit._id, targetHabit.frequency);
  const questName = getQuestCodename(targetHabit.title);

  return (
    <AnimatedCard
      className="rpg-glow-breathe relative mb-5 overflow-hidden border-[rgba(139,92,246,0.35)] p-5"
      data-testid="up-next-card"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 12% 0%, rgba(139,92,246,0.22), transparent 48%), radial-gradient(ellipse at 85% 20%, rgba(6,182,212,0.12), transparent 42%)",
        }}
      />
      <div className="relative z-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="type-stat-label rounded-full border border-[var(--border-subtle)] px-2 py-1 text-[var(--nebula-cyan)]">
              Active mission
            </span>
            <span className="rounded-full bg-[var(--stellar-gold-soft)] px-2 py-1 font-[var(--font-mono)] text-xs text-[var(--stellar-gold)]">
              +{QUEST_XP} XP
            </span>
            <span
              className="rounded-full px-2 py-1 font-[var(--font-mono)] text-xs"
              style={{
                background: status === "late" ? "var(--danger-soft)" : "var(--accent-soft)",
                color: status === "late" ? "var(--danger)" : "var(--accent)",
              }}
            >
              {timing}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div
              className="mt-1 h-3 w-3 flex-shrink-0 rounded-full shadow-[var(--glow-purple)]"
              style={{ background: color }}
            />
            <div className="min-w-0">
              <h2 className="truncate font-[var(--font-rpg)] text-2xl font-bold text-[var(--text-primary)]">
                {questName}
              </h2>
              {questName !== targetHabit.title && (
                <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                  Source habit: {targetHabit.title}
                </p>
              )}
              <p className="mt-2 font-[var(--font-mono)] text-xs text-[var(--text-tertiary)]">
                Scheduled at {formatDisplayTime(targetHabit.startTime)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MarkCompleteButton habitId={targetHabit._id} date={date} />
            <p className="text-xs text-[var(--text-tertiary)]">
              {completedCount}/{totalCount} missions cleared today
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <StreakShield streak={currentStreak} />
          <CompletionRing completed={completedCount} total={totalCount} size={64} />
        </div>
      </div>
    </AnimatedCard>
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
      <AnimatedCard className="mb-5 p-5" data-testid="up-next-card">
        <div
          className="animate-pulse rounded-md"
          style={{ height: 64, background: "var(--bg-sunken)" }}
        />
      </AnimatedCard>
    );
  }

  const { state, targetHabit, completedCount, totalCount } = derived;

  // ── State E: No habits ────────────────────────────────────────────────────
  if (state === "empty") {
    return (
      <>
        <AnimatedCard className="mb-5 p-5" data-testid="up-next-card">
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
        </AnimatedCard>
        <CreateHabitDialog isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      </>
    );
  }

  // ── State B: All done ─────────────────────────────────────────────────────
  if (state === "done") {
    return (
      <AnimatedCard className="mb-5 border-[var(--success)] p-5" data-testid="up-next-card">
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
      </AnimatedCard>
    );
  }

  // ── State D: End of day ───────────────────────────────────────────────────
  if (state === "endofday") {
    return (
      <AnimatedCard className="mb-5 p-5" data-testid="up-next-card">
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
      </AnimatedCard>
    );
  }

  // ── State A: Up next ──────────────────────────────────────────────────────
  if (state === "upnext" && targetHabit) {
    const diffMinutes = parseTimeToMinutes(targetHabit.startTime) - nowMinutes;
    return (
      <ActiveMissionDetails
        targetHabit={targetHabit}
        date={dateStr}
        completedCount={completedCount}
        totalCount={totalCount}
        timing={relativeTime(diffMinutes)}
        status="upnext"
      />
    );
  }

  // ── State C: Late ─────────────────────────────────────────────────────────
  if (state === "late" && targetHabit) {
    const diffMinutes = parseTimeToMinutes(targetHabit.startTime) - nowMinutes; // negative
    return (
      <ActiveMissionDetails
        targetHabit={targetHabit}
        date={dateStr}
        completedCount={completedCount}
        totalCount={totalCount}
        timing={`${Math.abs(diffMinutes)}m late`}
        status="late"
      />
    );
  }

  return null;
}
