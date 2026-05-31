"use client";

import Link from "next/link";
import { Star, Trophy, ChevronRight } from "lucide-react";
import { AnimatedCard } from "@/components/rpg/animated-card";
import { AchievementBadge } from "@/components/rpg/achievement-badge";
import { AchievementProgress } from "@/components/milestones/achievement-progress";
import { useHabits } from "@/hooks/use-habits";
import { useMilestones } from "@/hooks/use-milestones";
import { MILESTONES } from "@/lib/milestone-config";

export function AchievementSpotlight() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const firstHabit = habits?.[0];

  const { milestones, nextMilestone, isLoading: milestonesLoading } = useMilestones(
    firstHabit?._id,
    firstHabit?.frequency ?? "daily"
  );

  const isLoading = habitsLoading || milestonesLoading;

  if (isLoading) {
    return (
      <AnimatedCard className="mb-5 h-24 animate-shimmer" />
    );
  }

  // Nothing to show if no habits
  if (!firstHabit) return null;

  const recentUnlock = [...milestones].reverse().find((m) => m.isUnlocked);

  return (
    <AnimatedCard className="mb-5 p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} style={{ color: "var(--stellar-gold)" }} aria-hidden="true" />
          <p className="type-stat-label" style={{ color: "var(--stardust)" }}>Star Map Discoveries</p>
        </div>
        <Link
          href="/milestones"
          className="flex items-center gap-0.5 text-xs transition-colors hover:text-[var(--nebula-purple)]"
          style={{ color: "var(--asteroid)" }}
        >
          View all
          <ChevronRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {/* Progress to next achievement */}
      {nextMilestone && (
        <AchievementProgress
          nextMilestone={nextMilestone}

          totalCount={MILESTONES.length}
        />
      )}

      {/* Recently unlocked badge */}
      {recentUnlock && (
        <div className="mt-3 flex items-center gap-2 pt-3" style={{ borderTop: "1px solid var(--void-border)" }}>
          <Star size={12} style={{ color: "var(--stellar-gold)", flexShrink: 0 }} aria-hidden="true" />
          <span className="text-xs" style={{ color: "var(--stardust)" }}>
            Last unlocked:{" "}
            <span style={{ color: "var(--comet-white)", fontWeight: 600 }}>{recentUnlock.name}</span>
          </span>
          <AchievementBadge tier={recentUnlock.tier} className="ml-auto" />
        </div>
      )}

      {/* All unlocked state */}
      {!nextMilestone && (
        <p className="text-xs" style={{ color: "var(--stellar-gold)" }}>
          ★ All {MILESTONES.length} achievements unlocked — Legendary status!
        </p>
      )}
    </AnimatedCard>
  );
}
