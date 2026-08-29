"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Award, Sparkles, Flame } from "lucide-react";
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
      setSelectedHabitId(habits[0]!._id);
    }
  }, [habits, selectedHabitId]);

  const selectedHabit = habits?.find((h) => h._id === selectedHabitId);

  const { milestones, unlockedCount, isLoading: milestonesLoading } = useMilestones(
    selectedHabitId,
    selectedHabit?.frequency ?? "daily"
  );

  const noHabits = !habitsLoading && (!habits || habits.length === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <PageHeader
        title="Achievements & Trophies"
        description="Earn rare 3D holographic badges as you build consistency and hit unbroken streak milestones."
      />

      {noHabits ? (
        <EmptyState
          icon={<Trophy size={32} style={{ color: "var(--text-disabled)" }} />}
          title="No habits yet"
          description="Create a habit on the dashboard to start earning milestones."
        />
      ) : (
        <div className="space-y-6">
          {/* Habit selector — glass pills with spring animation */}
          {habits && habits.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel overflow-x-auto no-scrollbar">
              {habits.map((habit) => {
                const isSelected = habit._id === selectedHabitId;
                const color = habit.color ?? "var(--accent)";

                return (
                  <button
                    key={habit._id}
                    onClick={() => setSelectedHabitId(habit._id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-sunken)]"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="milestoneHabitPill"
                        className="absolute inset-0 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      {habit.title}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Milestone grid: Locked cards are locked, unlocked cards are 3D interactive */}
          <MilestoneGrid
            milestones={milestones}
            unlockedCount={unlockedCount}
            isLoading={habitsLoading || milestonesLoading}
          />
        </div>
      )}
    </motion.div>
  );
}
