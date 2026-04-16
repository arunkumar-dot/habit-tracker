"use client";

import { Lock, Check, Sprout, Flame, Zap, Medal, Trophy, Star, Gem, type LucideProps } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TIER_COLORS, type MilestoneIconName } from "@/lib/milestone-config";
import type { MilestoneProgress } from "@/hooks/use-milestones";

type IconComponent = React.FC<LucideProps>;

const MILESTONE_ICONS: Record<MilestoneIconName, IconComponent> = {
  Sprout, Flame, Zap, Medal, Trophy, Star, Gem,
};

interface MilestoneCardProps {
  milestone: MilestoneProgress;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { border, bg, text } = TIER_COLORS[milestone.tier];
  const MilestoneIcon = MILESTONE_ICONS[milestone.icon as MilestoneIconName] ?? Sprout;
  const pct = Math.round((milestone.progress / milestone.daysRequired) * 100);

  const achievedDate = milestone.achievedAt
    ? new Date(milestone.achievedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const daysLeft = milestone.daysRequired - milestone.progress;

  return (
    <div
      className="relative rounded-lg p-4 flex flex-col gap-3 transition-all"
      style={{
        background: milestone.isUnlocked ? bg : "var(--bg-elevated)",
        border: `1.5px solid ${milestone.isUnlocked ? border : "var(--border-subtle)"}`,
        opacity: milestone.isUnlocked ? 1 : 0.4,
      }}
    >
      {/* Lock overlay for locked milestones */}
      {!milestone.isUnlocked && (
        <div
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "var(--bg-hover)" }}
        >
          <Lock size={12} style={{ color: "var(--text-disabled)" }} />
        </div>
      )}

      {/* Icon + tier badge */}
      <div className="flex items-center gap-2">
        <span
          className="leading-none"
          style={{ color: milestone.isUnlocked ? border : "var(--text-disabled)" }}
        >
          <MilestoneIcon size={22} />
        </span>
        <span className="type-meta-label" style={{ color: "var(--text-tertiary)" }}>
          {milestone.tier}
        </span>
      </div>

      {/* Name + description */}
      <div>
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: milestone.isUnlocked ? "var(--text-primary)" : "var(--text-secondary)" }}
        >
          {milestone.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {milestone.description}
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {milestone.progress} / {milestone.daysRequired} days
          </span>
          {milestone.isUnlocked ? (
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: text }}>
              <Check size={11} /> Unlocked
            </span>
          ) : (
            <span className="text-xs" style={{ color: "var(--text-disabled)" }}>
              {daysLeft} to go
            </span>
          )}
        </div>
        <Progress
          value={pct}
          color={milestone.isUnlocked ? border : undefined}
        />
      </div>

      {/* Achievement date */}
      {achievedDate && (
        <p className="text-[11px]" style={{ color: text }}>
          Achieved {achievedDate}
        </p>
      )}
    </div>
  );
}
