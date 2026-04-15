"use client";

import { StreakRibbon } from "@/components/ui/streak-ribbon";
import { useStreak } from "@/hooks/use-streaks";
import type { HabitId } from "@/types";

interface HabitStreakBadgeProps {
  habitId: HabitId;
  frequency: "daily" | "weekly";
}

export function HabitStreakBadge({ habitId, frequency }: HabitStreakBadgeProps) {
  const { currentStreak, isLoading } = useStreak(habitId, frequency);

  if (isLoading) {
    // Skeleton sized to match StreakRibbon dimensions (56×28)
    return (
      <span
        className="inline-block rounded-md animate-shimmer"
        style={{ width: 56, height: 28, flexShrink: 0 }}
        aria-hidden="true"
      />
    );
  }

  return (
    <StreakRibbon
      count={currentStreak}
      title={`Current streak: ${currentStreak} ${frequency === "weekly" ? "week" : "day"}${currentStreak !== 1 ? "s" : ""}`}
    />
  );
}
