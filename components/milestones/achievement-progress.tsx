"use client";

import { Star } from "lucide-react";
import type { MilestoneProgress } from "@/hooks/use-milestones";

interface AchievementProgressProps {
  nextMilestone: MilestoneProgress | null;
  totalCount: number;
}

export function AchievementProgress({
  nextMilestone,
  totalCount,
}: AchievementProgressProps) {
  if (!nextMilestone) {
    return (
      <p className="text-xs" style={{ color: "var(--stellar-gold)" }}>
        ★ All {totalCount} achievements unlocked
      </p>
    );
  }

  const pct = Math.round((nextMilestone.progress / nextMilestone.daysRequired) * 100);
  const daysLeft = nextMilestone.daysRequired - nextMilestone.progress;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--stardust)" }}>
          <Star size={11} style={{ color: "var(--stellar-gold)" }} aria-hidden="true" />
          Next: <span style={{ color: "var(--comet-white)", fontWeight: 600 }}>{nextMilestone.name}</span>
          <span style={{ color: "var(--asteroid)" }}>
            ({nextMilestone.progress}/{nextMilestone.daysRequired} days)
          </span>
        </span>
        <span className="type-stat-label" style={{ color: "var(--asteroid)" }}>
          {daysLeft}d left
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: "var(--space-hover)" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${nextMilestone.name} progress: ${pct}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "var(--nebula-purple)" }}
        />
      </div>
    </div>
  );
}
