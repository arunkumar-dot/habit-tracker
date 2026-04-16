"use client";

import { Trophy } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import { useStreak } from "@/hooks/use-streaks";
import { Card } from "@/components/ui/card";
import { StreakRibbon } from "@/components/ui/streak-ribbon";
import { StreakRowSkeleton } from "@/components/ui/skeleton";
import type { Habit } from "@/types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card variant="default" padding="md">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "64px", fontWeight: 400, lineHeight: 1, color: "var(--text-primary)" }}>
            {value}
          </p>
          <p className="type-meta-label mt-1" style={{ color: "var(--text-tertiary)" }}>
            {label}
          </p>
        </div>
      </div>
    </Card>
  );
}

interface HabitStreakRowProps {
  habit: Habit;
}

function HabitStreakRow({ habit }: HabitStreakRowProps) {
  const { currentStreak, longestStreak, totalCompletions } = useStreak(
    habit._id,
    habit.frequency
  );

  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: habit.color ?? "#C2410C" }}
        />
        <span className="text-sm truncate cap-first" style={{ color: "var(--text-primary)" }}>
          {habit.title}
        </span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="flex flex-col items-end gap-1">
          <StreakRibbon
            count={currentStreak}
            title={`Current streak: ${currentStreak} day${currentStreak !== 1 ? "s" : ""}`}
          />
          <p className="type-meta-label" style={{ color: "var(--text-disabled)" }}>
            current
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            <Trophy size={13} style={{ color: "var(--text-tertiary)" }} />
            {longestStreak}
          </span>
          <p className="type-meta-label" style={{ color: "var(--text-disabled)" }}>
            best
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {totalCompletions}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-disabled)" }}>
            total
          </p>
        </div>
      </div>
    </div>
  );
}

export function StreakSummary() {
  const { habits, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
          Streak Leaderboard
        </h3>
        <Card variant="default" padding="none">
          <div className="px-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <StreakRowSkeleton key={i} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!habits || habits.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
        Streak Leaderboard
      </h3>
      <Card variant="default" padding="none">
        <div className="px-4">
          {habits.map((habit) => (
            <HabitStreakRow key={habit._id} habit={habit} />
          ))}
        </div>
      </Card>
    </div>
  );
}
