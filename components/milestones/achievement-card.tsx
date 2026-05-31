"use client";

import { Lock, Check, Sprout, Flame, Zap, Medal, Trophy, Star, Gem, type LucideProps } from "lucide-react";
import { motion } from "framer-motion";
import { AchievementBadge } from "@/components/rpg/achievement-badge";
import { cardMotionVariants } from "@/components/animations/motion-tokens";
import type { MilestoneIconName, MilestoneTier } from "@/lib/milestone-config";
import type { MilestoneProgress } from "@/hooks/use-milestones";

type IconComponent = React.FC<LucideProps>;

const MILESTONE_ICONS: Record<MilestoneIconName, IconComponent> = {
  Sprout, Flame, Zap, Medal, Trophy, Star, Gem,
};

const MILESTONE_XP = 50;

const TIER_COLOR: Record<MilestoneTier, string> = {
  bronze:   "var(--ember-orange)",
  silver:   "var(--stardust)",
  gold:     "var(--stellar-gold)",
  platinum: "var(--nebula-purple)",
};

const TIER_GLOW: Record<MilestoneTier, string> = {
  bronze:   "var(--glow-streak)",
  silver:   "none",
  gold:     "var(--glow-gold)",
  platinum: "var(--glow-purple)",
};

interface AchievementCardProps {
  milestone: MilestoneProgress;
}

export function AchievementCard({ milestone }: AchievementCardProps) {
  const MilestoneIcon = MILESTONE_ICONS[milestone.icon as MilestoneIconName] ?? Sprout;
  const pct = Math.round((milestone.progress / milestone.daysRequired) * 100);
  const daysLeft = milestone.daysRequired - milestone.progress;
  const inProgress = !milestone.isUnlocked && milestone.progress > 0;
  const color = TIER_COLOR[milestone.tier];
  const glow  = TIER_GLOW[milestone.tier];

  const achievedDate = milestone.achievedAt
    ? new Date(milestone.achievedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <motion.div
      variants={cardMotionVariants}
      className="relative flex flex-col gap-3 rounded-xl p-4"
      style={{
        background: milestone.isUnlocked
          ? `color-mix(in srgb, ${color} 8%, var(--space-surface))`
          : "var(--space-surface)",
        border: `1.5px solid ${
          milestone.isUnlocked
            ? `color-mix(in srgb, ${color} 55%, transparent)`
            : inProgress
              ? "var(--void-border-strong)"
              : "var(--void-border)"
        }`,
        boxShadow: milestone.isUnlocked && glow !== "none" ? glow : undefined,
        opacity: !milestone.isUnlocked && !inProgress ? 0.42 : 1,
      }}
    >
      {/* Lock icon for fully locked milestones */}
      {!milestone.isUnlocked && !inProgress && (
        <div
          aria-hidden="true"
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full"
          style={{ background: "var(--space-hover)" }}
        >
          <Lock size={12} style={{ color: "var(--asteroid)" }} />
        </div>
      )}

      {/* Check for unlocked */}
      {milestone.isUnlocked && (
        <div
          aria-hidden="true"
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full"
          style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }}
        >
          <Check size={12} style={{ color }} />
        </div>
      )}

      {/* Icon + tier */}
      <div className="flex items-center gap-2.5">
        <div
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full"
          style={{
            background: milestone.isUnlocked
              ? `color-mix(in srgb, ${color} 18%, transparent)`
              : "var(--space-hover)",
            boxShadow: milestone.isUnlocked && glow !== "none" ? glow : undefined,
          }}
        >
          <MilestoneIcon
            size={20}
            strokeWidth={milestone.isUnlocked ? 2 : 1.8}
            style={{ color: milestone.isUnlocked ? color : "var(--asteroid)" }}
            aria-hidden="true"
          />
        </div>
        <AchievementBadge tier={milestone.tier} />
      </div>

      {/* Name + description */}
      <div className="min-w-0">
        <p
          className="text-sm font-semibold leading-snug"
          style={{ color: milestone.isUnlocked ? "var(--comet-white)" : "var(--stardust)" }}
        >
          {milestone.name}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--asteroid)" }}>
          {milestone.description}
        </p>
      </div>

      {/* Progress section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs" style={{ color: "var(--stardust)" }}>
            {milestone.progress} / {milestone.daysRequired} days
          </span>
          {milestone.isUnlocked ? (
            <span className="type-stat-label" style={{ color }}>+{MILESTONE_XP} XP earned</span>
          ) : inProgress ? (
            <span className="text-xs" style={{ color: "var(--stardust)" }}>{daysLeft} to go</span>
          ) : (
            <span className="type-stat-label" style={{ color: "var(--asteroid)" }}>
              +{MILESTONE_XP} XP
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--space-hover)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: milestone.isUnlocked
                ? color
                : inProgress
                  ? "var(--nebula-purple)"
                  : "var(--asteroid)",
            }}
          />
        </div>
      </div>

      {/* Unlock date */}
      {achievedDate && (
        <p className="text-[11px]" style={{ color }}>
          Achieved {achievedDate}
        </p>
      )}
    </motion.div>
  );
}
