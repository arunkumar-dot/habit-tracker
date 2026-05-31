"use client";

import { Shield } from "lucide-react";
import { useStreak } from "@/hooks/use-streaks";
import type { HabitId } from "@/types";

interface HabitStreakBadgeProps {
  habitId: HabitId;
  frequency: "daily" | "weekly";
}

function shieldColor(streak: number): string {
  if (streak >= 14) return "var(--stellar-gold)";
  if (streak >= 7)  return "var(--ember-orange)";
  return "var(--stardust)";
}

export function HabitStreakBadge({ habitId, frequency }: HabitStreakBadgeProps) {
  const { currentStreak, isLoading } = useStreak(habitId, frequency);

  if (isLoading) {
    return (
      <span
        className="inline-block rounded-md animate-shimmer"
        style={{ width: 44, height: 22, flexShrink: 0 }}
        aria-hidden="true"
      />
    );
  }

  if (currentStreak < 1) return null;

  const color = shieldColor(currentStreak);
  const unit = frequency === "weekly" ? "wk" : "d";
  const label = `${currentStreak}-${unit === "d" ? "day" : "week"} streak`;

  return (
    <span
      title={label}
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 flex-shrink-0"
      style={{
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        color,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "var(--font-rpg)",
        lineHeight: 1,
      }}
    >
      <Shield size={11} strokeWidth={2.2} aria-hidden="true" />
      {currentStreak}{unit}
    </span>
  );
}
