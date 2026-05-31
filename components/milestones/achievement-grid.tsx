"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";
import { AchievementCard } from "./achievement-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motionStaggers } from "@/components/animations/motion-tokens";
import { MILESTONES } from "@/lib/milestone-config";
import type { MilestoneProgress } from "@/hooks/use-milestones";

interface AchievementGridProps {
  milestones: MilestoneProgress[];
  unlockedCount: number;
  isLoading: boolean;
}

export function AchievementGrid({ milestones, unlockedCount, isLoading }: AchievementGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: MILESTONES.length }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  const allUnlocked = unlockedCount === MILESTONES.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--stardust)" }}>
          <span className="font-[var(--font-rpg)] font-bold" style={{ color: "var(--comet-white)" }}>
            {unlockedCount}
          </span>
          {" / "}
          <span>{MILESTONES.length}</span>
          {" discoveries"}
        </p>
        {allUnlocked && (
          <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--stellar-gold)" }}>
            <Gem size={13} aria-hidden="true" />
            All discovered
          </span>
        )}
      </div>

      {/* Staggered card grid */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: motionStaggers.list } }}
      >
        {milestones.map((milestone) => (
          <AchievementCard key={milestone.daysRequired} milestone={milestone} />
        ))}
      </motion.div>
    </div>
  );
}
