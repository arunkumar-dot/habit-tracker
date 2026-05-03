"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { HabitCompletionButton } from "@/components/habits/habit-completion-button";
import { HabitStreakBadge } from "@/components/habits/habit-streak-badge";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { today } from "@/lib/date-utils";
import { formatDisplayTime, sortHabitsByTime } from "@/lib/time-utils";
import type { Habit, HabitCompletion } from "@/types";

// ── Active (uncompleted) habit row ────────────────────────────────────────────

function ActiveHabitRow({ habit, date }: { habit: Habit; date: string }) {
  const { isCompleted, toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "#C2410C";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div
        className="flex-shrink-0"
        style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {habit.title}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
        >
          {formatDisplayTime(habit.startTime)}
        </p>
      </div>
      <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
      <HabitCompletionButton
        isCompleted={isCompleted}
        onToggle={toggle}
        color={color}
        size="sm"
      />
    </motion.div>
  );
}

// ── Completed habit row (compact, celebration tone) ───────────────────────────

function CompletedHabitRow({ habit, date }: { habit: Habit; date: string }) {
  const { toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "#C2410C";

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 py-2.5"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div
        className="flex-shrink-0"
        style={{ width: 8, height: 8, borderRadius: "50%", background: color, opacity: 0.5 }}
      />
      <p className="flex-1 text-sm truncate" style={{ color: "var(--text-secondary)" }}>
        {habit.title}
      </p>
      <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
      <HabitCompletionButton
        isCompleted={true}
        onToggle={toggle}
        color={color}
        size="sm"
      />
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TodaysHabits() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const dateStr = today();
  const { completions, completedHabitIds, isLoading: completionsLoading } = useCompletionsForDate(dateStr);

  const { activeHabits, completedHabits } = useMemo(() => {
    if (!habits) return { activeHabits: [], completedHabits: [] };

    const active = sortHabitsByTime(habits.filter((h) => !completedHabitIds.has(h._id)));

    // Sort completed by completedAt descending (most recently completed first)
    const completionsMap = new Map<string, number>(
      (completions ?? []).map((c: HabitCompletion) => [c.habitId as string, c.completedAt])
    );
    const completed = habits
      .filter((h) => completedHabitIds.has(h._id))
      .sort((a, b) => {
        const aTime = completionsMap.get(a._id as string) ?? 0;
        const bTime = completionsMap.get(b._id as string) ?? 0;
        return bTime - aTime;
      });

    return { activeHabits: active, completedHabits: completed };
  }, [habits, completedHabitIds, completions]);

  // Don't render when no habits exist — UpNextCard State E covers the empty state
  if (!habitsLoading && !completionsLoading && (!habits || habits.length === 0)) return null;

  if (habitsLoading || completionsLoading) {
    return (
      <Card variant="default" padding="md" className="mb-5" data-testid="todays-habits">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse h-10 rounded-md"
              style={{ background: "var(--bg-sunken)" }}
            />
          ))}
        </div>
      </Card>
    );
  }

  const totalCount = habits?.length ?? 0;
  const remainingCount = activeHabits.length;

  return (
    <Card variant="default" padding="md" className="mb-5" data-testid="todays-habits">
      {/* ── Active (uncompleted) section ──────────────────────────────────── */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Today
        </h2>
        {remainingCount > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "var(--bg-sunken)",
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {remainingCount} of {totalCount} remaining
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {activeHabits.length > 0 ? (
          activeHabits.map((habit) => (
            <ActiveHabitRow key={habit._id} habit={habit} date={dateStr} />
          ))
        ) : (
          <motion.p
            key="all-done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm py-3"
            style={{
              color: "var(--text-secondary)",
              borderBottom:
                completedHabits.length > 0 ? "1px solid var(--border-subtle)" : undefined,
            }}
          >
            You&apos;ve completed everything today 🎉
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Completed section ──────────────────────────────────────────────── */}
      {completedHabits.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Completed
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--bg-sunken)",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {completedHabits.length}
            </span>
          </div>
          <AnimatePresence initial={false}>
            {completedHabits.map((habit) => (
              <CompletedHabitRow key={habit._id} habit={habit} date={dateStr} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
