"use client";

import { MilestoneCard } from "./milestone-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MilestoneProgress } from "@/hooks/use-milestones";
import { MILESTONES } from "@/lib/milestone-config";

interface MilestoneGridProps {
  milestones: MilestoneProgress[];
  unlockedCount: number;
  isLoading: boolean;
}

export function MilestoneGrid({ milestones, unlockedCount, isLoading }: MilestoneGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: MILESTONES.length }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
          {unlockedCount} / {MILESTONES.length}
        </span>{" "}
        milestones unlocked
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {milestones.map((milestone) => (
          <MilestoneCard key={milestone.daysRequired} milestone={milestone} />
        ))}
      </div>
    </div>
  );
}
