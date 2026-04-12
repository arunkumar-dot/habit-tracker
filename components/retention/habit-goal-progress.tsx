"use client";

import { Progress } from "@/components/ui/progress";
import { useWeeklyGoal } from "@/hooks/use-weekly-goals";
import type { HabitId } from "@/types";

interface HabitGoalProgressProps {
  habitId: HabitId;
  weeklyGoal: number | undefined;
}

/**
 * Shows weekly completion progress for a habit with a set weeklyGoal.
 * Renders nothing if no weeklyGoal is configured.
 */
export function HabitGoalProgress({ habitId, weeklyGoal }: HabitGoalProgressProps) {
  const { completedThisWeek, weeklyGoal: goal, isLoading } = useWeeklyGoal(habitId, weeklyGoal);

  if (!goal || isLoading) return null;

  const pct = Math.min(100, (completedThisWeek / goal) * 100);
  const isDone = completedThisWeek >= goal;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
          This week
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{ color: isDone ? "var(--accent-success)" : "var(--text-secondary)" }}
        >
          {completedThisWeek} / {goal}
        </span>
      </div>
      <Progress
        value={pct}
        color={isDone ? "var(--accent-success)" : "var(--accent-primary)"}
        className="h-1"
      />
    </div>
  );
}
