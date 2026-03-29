"use client";

import { ListChecks } from "lucide-react";
import { HabitCard } from "./habit-card";
import { HabitCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { Habit } from "@/types";

interface HabitListProps {
  habits: Habit[] | undefined;
  date: string;
  isLoading: boolean;
  onEdit: (habit: Habit) => void;
  onAddNew: () => void;
}

export function HabitList({
  habits,
  date,
  isLoading,
  onEdit,
  onAddNew,
}: HabitListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <HabitCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <EmptyState
        icon={<ListChecks size={28} />}
        title="No habits yet"
        description="Create your first habit to start building better routines."
        action={
          <Button variant="primary" onClick={onAddNew}>
            Create your first habit
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit._id}
          habit={habit}
          date={date}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
