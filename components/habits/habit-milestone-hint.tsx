"use client";

import { Sprout, Flame, Zap, Medal, Trophy, Star, Gem, type LucideProps } from "lucide-react";
import { useMilestones } from "@/hooks/use-milestones";
import { type MilestoneIconName } from "@/lib/milestone-config";
import type { HabitId } from "@/types";

type IconComponent = React.FC<LucideProps>;

const MILESTONE_ICONS: Record<MilestoneIconName, IconComponent> = {
  Sprout, Flame, Zap, Medal, Trophy, Star, Gem,
};

interface HabitMilestoneHintProps {
  habitId: HabitId;
  frequency?: "daily" | "weekly";
}

/**
 * Displays the next locked milestone as a compact inline hint.
 * Example: "Next: First Week (5/7)"
 * Returns null when all milestones are unlocked or data is loading.
 */
export function HabitMilestoneHint({ habitId, frequency = "daily" }: HabitMilestoneHintProps) {
  const { nextMilestone, isLoading } = useMilestones(habitId, frequency);

  if (isLoading || !nextMilestone) return null;

  const Icon = MILESTONE_ICONS[nextMilestone.icon as MilestoneIconName] ?? Sprout;

  return (
    <span
      className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md"
      style={{
        color: "var(--text-secondary)",
        background: "var(--bg-hover)",
      }}
    >
      <Icon size={11} />
      Next:{" "}
      <span style={{ color: "var(--text-primary)" }}>{nextMilestone.name}</span>
      &nbsp;({nextMilestone.progress}/{nextMilestone.daysRequired})
    </span>
  );
}
