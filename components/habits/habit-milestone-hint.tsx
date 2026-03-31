"use client";

import { useMilestones } from "@/hooks/use-milestones";
import type { HabitId } from "@/types";

interface HabitMilestoneHintProps {
  habitId: HabitId;
  frequency?: "daily" | "weekly";
}

/**
 * Displays the next locked milestone as a compact inline hint.
 * Example: "Next: 🔥 First Week (5/7)"
 * Returns null when all milestones are unlocked or data is loading.
 */
export function HabitMilestoneHint({ habitId, frequency = "daily" }: HabitMilestoneHintProps) {
  const { nextMilestone, isLoading } = useMilestones(habitId, frequency);

  if (isLoading || !nextMilestone) return null;

  return (
    <span
      className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md"
      style={{
        color: "var(--text-secondary)",
        background: "var(--bg-hover)",
      }}
    >
      {nextMilestone.icon} Next:{" "}
      <span style={{ color: "var(--text-primary)" }}>{nextMilestone.name}</span>
      &nbsp;({nextMilestone.progress}/{nextMilestone.daysRequired})
    </span>
  );
}
