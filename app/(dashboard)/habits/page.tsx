"use client";

import { useState, useMemo } from "react";
import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ReflectionPrompt } from "@/components/journal/reflection-prompt";
import { Button } from "@/components/ui/button";
import { HabitList } from "@/components/habits/habit-list";
import { HabitFilters } from "@/components/habits/habit-filters";
import { CreateHabitDialog, EditHabitDialog } from "@/components/habits/habit-dialog";
import { Progress } from "@/components/ui/progress";
import { DashboardContentSkeleton } from "@/components/ui/skeleton";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { today } from "@/lib/date-utils";
import type { Habit } from "@/types";

type FrequencyFilter = "all" | "daily" | "weekly";

import { motion } from "framer-motion";

export default function HabitsPage() {
  const { isLoaded, isSignedIn } = useUser();

  const selectedDate = today();
  const { habits, isLoading: habitsLoading } = useHabits();
  const { completedHabitIds, isLoading: completionsLoading } =
    useCompletionsForDate(selectedDate);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [search, setSearch] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<FrequencyFilter>("all");

  const isLoading = habitsLoading || completionsLoading;

  const filteredHabits = useMemo(() => {
    if (!habits) return undefined;
    return habits.filter((h) => {
      const matchesSearch =
        search === "" ||
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.description?.toLowerCase().includes(search.toLowerCase());
      const matchesFrequency =
        frequencyFilter === "all" || h.frequency === frequencyFilter;
      return matchesSearch && matchesFrequency;
    });
  }, [habits, search, frequencyFilter]);

  const totalCount = filteredHabits?.length ?? 0;
  const completedCount =
    filteredHabits?.filter((h) => completedHabitIds.has(h._id)).length ?? 0;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!isLoaded) return <DashboardContentSkeleton />;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-6"
    >
      <PageHeader
        title="Habits Hub"
        description="Organize your daily and weekly habits."
        actions={
          <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} />
            New Habit
          </Button>
        }
      />

      {/* Progress card */}
      {totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="glass-card rounded-2xl p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              Today&apos;s Progress
            </span>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background:
                  completedCount === totalCount
                    ? "color-mix(in srgb, var(--success) 15%, transparent)"
                    : "color-mix(in srgb, var(--accent) 15%, transparent)",
                color:
                  completedCount === totalCount
                    ? "var(--success)"
                    : "var(--accent)",
              }}
            >
              {completedCount} of {totalCount} completed ({Math.round(progressPct)}%)
            </span>
          </div>
          <Progress
            value={progressPct}
            color={completedCount === totalCount ? "var(--success)" : "var(--accent)"}
          />
        </motion.div>
      )}

      {/* Filters */}
      {(habits?.length ?? 0) > 0 && (
        <HabitFilters
          search={search}
          onSearchChange={setSearch}
          frequencyFilter={frequencyFilter}
          onFrequencyChange={setFrequencyFilter}
          totalCount={habits?.length ?? 0}
          completedCount={habits?.filter((h) => completedHabitIds.has(h._id)).length ?? 0}
        />
      )}

      {/* Habits list */}
      <HabitList
        habits={filteredHabits}
        date={selectedDate}
        isLoading={isLoading}
        onEdit={(habit) => setEditingHabit(habit)}
        onAddNew={() => setIsCreateOpen(true)}
      />

      {/* Reflection prompt */}
      <div className="mt-4">
        <ReflectionPrompt />
      </div>

      {/* Create / Edit Dialogs */}
      <CreateHabitDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <EditHabitDialog
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
      />
    </motion.div>
  );
}
