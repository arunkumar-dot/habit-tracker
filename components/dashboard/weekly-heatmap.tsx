"use client";

import { useMemo } from "react";
import { AnimatedCard } from "@/components/rpg/animated-card";
import { Heatmap } from "@/components/Heatmap";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDateRange } from "@/hooks/use-completions";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { today, addDays } from "@/lib/date-utils";

export function WeeklyHeatmap() {
  const isMobile = useIsMobile();
  const dateStr = today();
  const sevenDaysAgo = addDays(dateStr, -6);
  const year = new Date().getFullYear();
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  const { habits } = useHabits();
  const { completions } = useCompletionsForDateRange(sevenDaysAgo, dateStr);

  const weekStats = useMemo(() => {
    if (!completions || !habits || habits.length === 0) return null;
    // Count unique habit-day completions in the last 7 days
    const unique = new Set(completions.map((c) => `${c.habitId as string}-${c.date}`));
    return { completed: unique.size, total: habits.length * 7 };
  }, [completions, habits]);

  return (
    <AnimatedCard className="mb-5 p-4" data-testid="weekly-heatmap">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="type-stat-label text-[var(--nebula-cyan)]">Weekly mission log</p>
          <h2 className="type-quest-title text-[var(--text-primary)]">Completion Star Map</h2>
        </div>
        {weekStats && (
          <p
            className="max-w-[13rem] text-right text-xs"
            style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
          >
            {weekStats.completed}/{weekStats.total} cleared
          </p>
        )}
      </div>
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(139,92,246,0.05)] p-3">
        <Heatmap
          startDate={yearStart}
          endDate={yearEnd}
          cellSize={isMobile ? 16 : 12}
          variant="nebula"
        />
      </div>
    </AnimatedCard>
  );
}
