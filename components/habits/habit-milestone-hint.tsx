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

export function HabitMilestoneHint({ habitId, frequency = "daily" }: HabitMilestoneHintProps) {
  const { nextMilestone, isLoading } = useMilestones(habitId, frequency);

  if (isLoading || !nextMilestone) return null;

  const Icon = MILESTONE_ICONS[nextMilestone.icon as MilestoneIconName] ?? Sprout;

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-md"
      style={{
        color: "var(--stardust)",
        background: "var(--nebula-purple-soft)",
        border: "1px solid color-mix(in srgb, var(--nebula-purple) 20%, transparent)",
      }}
    >
      <Star size={10} style={{ color: "var(--stellar-gold)", flexShrink: 0 }} aria-hidden="true" />
      <Icon size={10} aria-hidden="true" />
      <span>Next:</span>
      <span style={{ color: "var(--comet-white)", fontWeight: 600 }}>{nextMilestone.name}</span>
      <span style={{ color: "var(--asteroid)" }}>
        ({nextMilestone.progress}/{nextMilestone.daysRequired})
      </span>
    </span>
  );
}
