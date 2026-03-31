"use client";

import { Lock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TIER_COLORS } from "@/lib/milestone-config";
import type { MilestoneProgress } from "@/hooks/use-milestones";

interface MilestoneCardProps {
  milestone: MilestoneProgress;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { border, bg, text } = TIER_COLORS[milestone.tier];
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
      className="relative rounded-2xl p-4 flex flex-col gap-3 transition-all"
      style={{
        background: milestone.isUnlocked ? bg : "var(--bg-surface)",
        border: `1.5px solid ${milestone.isUnlocked ? border : "var(--border)"}`,
        opacity: milestone.isUnlocked ? 1 : 0.75,
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
          className="text-2xl leading-none"
          style={{ filter: milestone.isUnlocked ? "none" : "grayscale(1)" }}
        >
          {milestone.icon}
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ color: text, background: bg, border: `1px solid ${border}` }}
        >
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
            <span className="text-xs font-medium" style={{ color: text }}>
              ✓ Unlocked
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
