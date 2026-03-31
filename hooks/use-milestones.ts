"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MILESTONES, type MilestoneConfig } from "@/lib/milestone-config";
import { useStreak } from "./use-streaks";
import type { HabitId } from "@/types";

export interface MilestoneProgress extends MilestoneConfig {
  isUnlocked: boolean;
  achievedAt?: number;
  /** Current progress capped at daysRequired */
  progress: number;
}

/**
 * Returns per-milestone progress for a given habit.
 * - isUnlocked: milestone has been officially awarded
 * - progress: currentStreak capped at daysRequired (for progress bar)
 * - nextMilestone: the first locked milestone (or null if all unlocked)
 */
export function useMilestones(
  habitId: HabitId | undefined,
  frequency: "daily" | "weekly" = "daily"
): {
  milestones: MilestoneProgress[];
  nextMilestone: MilestoneProgress | null;
  unlockedCount: number;
  isLoading: boolean;
} {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();

  const awards = useQuery(
    api.milestones.getUserMilestones,
    !authLoading && isAuthenticated && habitId ? { habitId } : "skip"
  );

  const { currentStreak, isLoading: streakLoading } = useStreak(habitId, frequency);

  const isLoading =
    authLoading ||
    (isAuthenticated && habitId !== undefined && awards === undefined) ||
    streakLoading;

  const earnedDays = new Set((awards ?? []).map((a) => a.daysRequired));

  const milestones: MilestoneProgress[] = MILESTONES.map((m) => {
    const award = (awards ?? []).find((a) => a.daysRequired === m.daysRequired);
    return {
      ...m,
      isUnlocked: earnedDays.has(m.daysRequired),
      achievedAt: award?.achievedAt,
      progress: Math.min(currentStreak, m.daysRequired),
    };
  });

  const nextMilestone = milestones.find((m) => !m.isUnlocked) ?? null;
  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;

  return { milestones, nextMilestone, unlockedCount, isLoading };
}
