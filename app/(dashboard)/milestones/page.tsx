"use client";

import { useState, useEffect } from "react";
import { Map } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AchievementGrid } from "@/components/milestones/achievement-grid";
import { AchievementProgress } from "@/components/milestones/achievement-progress";
import { EmptyState } from "@/components/ui/empty-state";
import { useHabits } from "@/hooks/use-habits";
import { useMilestones } from "@/hooks/use-milestones";
import { MILESTONES } from "@/lib/milestone-config";
import type { HabitId } from "@/types";

export default function MilestonesPage() {
  const { habits, isLoading: habitsLoading } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<HabitId | undefined>(undefined);

  useEffect(() => {
    if (!selectedHabitId && habits && habits.length > 0) {
      const timer = setTimeout(() => setSelectedHabitId(habits[0]!._id), 0);
      return () => clearTimeout(timer);
    }
  }, [habits, selectedHabitId]);

  const selectedHabit = habits?.find((h) => h._id === selectedHabitId);

  const { milestones, nextMilestone, unlockedCount, isLoading: milestonesLoading } = useMilestones(
    selectedHabitId,
    selectedHabit?.frequency ?? "daily"
  );

  const noHabits = !habitsLoading && (!habits || habits.length === 0);

  return (
    <>
      <PageHeader
        title="Star Map Discoveries"
        description="Track your achievements and unlock new cosmic milestones"
      />

      {noHabits ? (
        <EmptyState
          icon={<Map size={32} style={{ color: "var(--asteroid)" }} />}
          title="No quests yet"
          description="Create a habit on the Quest Board to start earning achievements."
        />
      ) : (
        <div className="space-y-5">
          {/* Habit selector */}
          {habits && habits.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {habits.map((habit) => {
                const isActive = habit._id === selectedHabitId;
                return (
                  <button
                    key={habit._id}
                    onClick={() => setSelectedHabitId(habit._id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors"
                    style={
                      isActive
                        ? { background: "var(--nebula-purple)", color: "white" }
                        : {
                            background: "var(--space-surface)",
                            border: "1px solid var(--void-border)",
                            color: "var(--stardust)",
                          }
                    }
                  >
                    {habit.color && (
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                        style={{ background: habit.color }}
                      />
                    )}
                    {habit.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Next milestone progress bar — shown while any locked milestone remains */}
          {!milestonesLoading && selectedHabit && (
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--space-surface)",
                border: "1px solid var(--void-border)",
              }}
            >
              <AchievementProgress
                nextMilestone={nextMilestone}
                totalCount={MILESTONES.length}
              />
            </div>
          )}

          {/* Achievement grid */}
          <AchievementGrid
            milestones={milestones}
            unlockedCount={unlockedCount}
            isLoading={habitsLoading || milestonesLoading}
          />
        </div>
      )}
    </>
  );
}
