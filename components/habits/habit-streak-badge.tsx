"use client";

import { Flame } from "lucide-react";
import { useStreak } from "@/hooks/use-streaks";
import type { HabitId } from "@/types";

interface HabitStreakBadgeProps {
  habitId: HabitId;
  frequency: "daily" | "weekly";
}

export function HabitStreakBadge({ habitId, frequency }: HabitStreakBadgeProps) {
  const { currentStreak, isLoading } = useStreak(habitId, frequency);

  if (isLoading) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs animate-shimmer"
        style={{ width: 48, height: 20 }}
      />
    );
  }

  if (currentStreak === 0) return null;

  // Color gradient: 1-6 days = amber, 7-29 days = orange, 30+ = red
  const flameColor =
    currentStreak >= 30
      ? "#ef4444"
      : currentStreak >= 7
      ? "#f97316"
      : "#f59e0b";

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: `${flameColor}20`,
        color: flameColor,
        border: `1px solid ${flameColor}40`,
      }}
      title={`Current streak: ${currentStreak} ${frequency === "weekly" ? "week" : "day"}${currentStreak !== 1 ? "s" : ""}`}
    >
      <Flame size={11} fill={flameColor} />
      {currentStreak}
    </span>
  );
}
