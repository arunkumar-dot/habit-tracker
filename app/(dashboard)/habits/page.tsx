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
    <>
      <PageHeader
        title="Quest Board"
        actions={
          <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} />
            New Quest
          </Button>
        }
      />

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="type-meta-label" style={{ color: "var(--stardust)" }}>
              Mission Progress
            </span>
            <span
              className="type-meta-label"
              style={{
                color:
                  completedCount === totalCount
                    ? "var(--plasma-green)"
                    : "var(--stardust)",
              }}
            >
              {completedCount}/{totalCount} complete
            </span>
          </div>
          <Progress
            value={progressPct}
            color={completedCount === totalCount ? "var(--success)" : "var(--accent)"}
          />
        </div>
      )}

      {/* Filters */}
      {(habits?.length ?? 0) > 0 && (
        <div className="mb-5">
          <HabitFilters
            search={search}
            onSearchChange={setSearch}
            frequencyFilter={frequencyFilter}
            onFrequencyChange={setFrequencyFilter}
            totalCount={totalCount}
            completedCount={completedCount}
          />
        </div>
      )}

      <HabitList
        habits={filteredHabits}
        date={selectedDate}
        isLoading={isLoading}
        onEdit={setEditingHabit}
        onAddNew={() => setIsCreateOpen(true)}
      />

      {/* Journal reflection prompt — shown after completing ≥1 habit, hidden once entry exists */}
      {completedHabitIds.size > 0 && <ReflectionPrompt />}

      <CreateHabitDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditHabitDialog
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
      />
    </>
  );
}
