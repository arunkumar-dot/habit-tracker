"use client";

import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MilestoneGrid } from "@/components/milestones/milestone-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { useHabits } from "@/hooks/use-habits";
import { useMilestones } from "@/hooks/use-milestones";
import type { HabitId } from "@/types";

export default function MilestonesPage() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<HabitId | undefined>(undefined);

  // Default to first habit once loaded
  useEffect(() => {
    if (!selectedHabitId && habits && habits.length > 0) {
      const timer = setTimeout(() => setSelectedHabitId(habits[0]!._id), 0);
      return () => clearTimeout(timer);
    }
  }, [habits, selectedHabitId]);

  const selectedHabit = habits?.find((h) => h._id === selectedHabitId);

  const { milestones, unlockedCount, isLoading: milestonesLoading } = useMilestones(
    selectedHabitId,
    selectedHabit?.frequency ?? "daily"
  );

  const noHabits = !habitsLoading && (!habits || habits.length === 0);

  return (
    <>
      <PageHeader
        title="Milestones"
        description="Track your achievements and consistency rewards"
      />

      {noHabits ? (
        <EmptyState
          icon={<Trophy size={32} style={{ color: "var(--text-disabled)" }} />}
          title="No habits yet"
          description="Create a habit on the dashboard to start earning milestones."
        />
      ) : (
        <div className="space-y-6">
          {/* Habit selector — segmented control */}
          {habits && habits.length > 1 && (
            <div className="flex flex-wrap items-end gap-0">
              {habits.map((habit) => {
                const isActive = habit._id === selectedHabitId;
                return (
                  <button
                    key={habit._id}
                    onClick={() => setSelectedHabitId(habit._id)}
                    className="seg-btn"
                    data-active={isActive}
                  >
                    {habit.color && (
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-1.5"
                        style={{ background: habit.color }}
                      />
                    )}
                    {habit.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Milestone grid */}
          <MilestoneGrid
            milestones={milestones}
            unlockedCount={unlockedCount}
            isLoading={habitsLoading || milestonesLoading}
          />
        </div>
      )}
    </>
  );
}
