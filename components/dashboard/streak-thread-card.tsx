"use client";

import { AnimatedCard } from "@/components/rpg/animated-card";
import { StreakThread } from "@/components/StreakThread";
import { buildWeeklyMissionDays } from "@/lib/rpg-dashboard";
import type { HabitCompletion } from "@/types";

interface StreakThreadCardProps {
  completions: HabitCompletion[] | undefined;
  isLoading?: boolean;
}

export function StreakThreadCard({ completions, isLoading = false }: StreakThreadCardProps) {
  const days = buildWeeklyMissionDays({ completions });

  return (
    <AnimatedCard className="mb-5 p-4" data-testid="dashboard-streak-thread">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="type-stat-label text-[var(--nebula-cyan)]">Streak thread</p>
          <h2 className="type-quest-title text-[var(--text-primary)]">Momentum Signal</h2>
        </div>
        <span className="rounded-full border border-[var(--border-subtle)] px-2 py-1 font-[var(--font-mono)] text-xs text-[var(--text-secondary)]">
          7 days
        </span>
      </div>
      {isLoading ? (
        <div className="h-14 animate-pulse rounded-md bg-[var(--bg-sunken)]" />
      ) : (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(139,92,246,0.06)] px-3 py-2">
          <StreakThread
            days={days}
            variant="week"
            tone="space"
            ariaLabel="Mission completion momentum over the last 7 days"
          />
        </div>
      )}
    </AnimatedCard>
  );
}
