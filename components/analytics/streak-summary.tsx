"use client";

import { Flame, Trophy, CheckCircle, TrendingUp } from "lucide-react";
import { useHabits } from "@/hooks/use-habits";
import { useStreak } from "@/hooks/use-streaks";
import { Card } from "@/components/ui/card";
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
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {value}
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
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
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: habit.color ?? "#6366f1" }}
        />
        <span className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
          {habit.title}
        </span>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: "var(--accent-warning)" }}>
            🔥 {currentStreak}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-disabled)" }}>
            current
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: "var(--accent-primary)" }}>
            🏆 {longestStreak}
          </p>
          <p className="text-[10px]" style={{ color: "var(--text-disabled)" }}>
            best
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold" style={{ color: "var(--accent-success)" }}>
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
