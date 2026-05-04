"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
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
    <Card variant="default" padding="md" className="mb-5" data-testid="weekly-heatmap">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          This week
        </h2>
        {weekStats && (
          <p
            className="text-xs"
            style={{ color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}
          >
            {weekStats.completed} of {weekStats.total} habits completed this week
          </p>
        )}
      </div>
      <Heatmap
        startDate={yearStart}
        endDate={yearEnd}
        cellSize={isMobile ? 16 : 12}
      />
    </Card>
  );
}
