"use client";

import { Clock, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HabitCompletionButton } from "./habit-completion-button";
import { HabitStreakBadge } from "./habit-streak-badge";
import { HabitMenu } from "./habit-menu";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { formatDisplayTime, formatDuration, getDurationMinutes } from "@/lib/date-utils";
import type { Habit } from "@/types";

interface HabitCardProps {
  habit: Habit;
  date: string;
  onEdit: (habit: Habit) => void;
}

export function HabitCard({ habit, date, onEdit }: HabitCardProps) {
  const { isCompleted, toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "#6366f1";

  const timeLabel = habit.endTime
    ? `${formatDisplayTime(habit.startTime)} – ${formatDisplayTime(habit.endTime)}`
    : formatDisplayTime(habit.startTime);

  const duration =
    habit.endTime
      ? formatDuration(getDurationMinutes(habit.startTime, habit.endTime))
      : null;

  return (
    <div
      className="relative rounded-2xl flex items-start gap-3 p-4 transition-all"
      style={{
        background: "var(--bg-surface)",
        border: `1px solid var(--border)`,
        opacity: isCompleted ? 0.75 : 1,
      }}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
        style={{ background: color }}
      />

      {/* Icon placeholder */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-0.5 ml-2"
        style={{ background: `${color}20` }}
      >
        <span style={{ color }}>●</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className="font-medium text-sm leading-snug"
              style={{
                color: "var(--text-primary)",
                textDecoration: isCompleted ? "line-through" : "none",
                opacity: isCompleted ? 0.6 : 1,
              }}
            >
              {habit.title}
            </p>
            {habit.description && (
              <p
                className="text-xs mt-0.5 truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {habit.description}
              </p>
            )}
          </div>
          <HabitMenu habit={habit} onEdit={onEdit} />
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <Clock size={11} />
            {timeLabel}
          </span>
          {duration && (
            <Badge variant="default" className="text-[10px]">
              {duration}
            </Badge>
          )}
          <Badge variant={habit.frequency === "daily" ? "info" : "purple"} className="text-[10px]">
            <Repeat size={9} />
            {habit.frequency === "daily" ? "Daily" : "Weekly"}
          </Badge>
          <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
        </div>
      </div>

      {/* Completion toggle */}
      <div className="flex-shrink-0 mt-1">
        <HabitCompletionButton
          isCompleted={isCompleted}
          onToggle={toggle}
          color={color}
        />
      </div>
    </div>
  );
}
