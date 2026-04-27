"use client";

import { Clock } from "lucide-react";
import { HabitCompletionButton } from "@/components/habits/habit-completion-button";
import { HabitStreakBadge } from "@/components/habits/habit-streak-badge";
import { Badge } from "@/components/ui/badge";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { formatTimeRange, formatDisplayTime, formatDuration, getDurationMinutes } from "@/lib/time-utils";
import type { Habit } from "@/types";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  habit: Habit;
  date: string;
  isCurrent: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  isLast: boolean;
}

export function TimelineItem({
  habit,
  date,
  isCurrent,
  isUpcoming,
  isPast,
  isLast,
}: TimelineItemProps) {
  const { isCompleted, toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "#C2410C";

  const timeDisplay = habit.endTime
    ? formatTimeRange(habit.startTime, habit.endTime)
    : formatDisplayTime(habit.startTime);

  const duration =
    habit.endTime
      ? formatDuration(getDurationMinutes(habit.startTime, habit.endTime))
      : null;

  return (
    <div className="flex gap-3 group">
      {/* Left: timeline dot + line */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        {/* Dot */}
        <div
          className={cn(
            "rounded-full flex-shrink-0 z-10 mt-4 transition-all",
            isCurrent && "animate-pulse-ring"
          )}
          style={{
            width: "10px",
            height: "10px",
            background: color,
            opacity: isPast && !isCompleted ? 0.4 : 1,
            boxShadow: isCurrent ? `0 0 0 4px ${color}30` : undefined,
          }}
        />
        {/* Connecting line (not for last item) */}
        {!isLast && (
          <div
            className="w-px flex-1 min-h-[20px]"
            style={{ background: "var(--timeline-line)" }}
          />
        )}
      </div>

      {/* Right: habit content */}
      <div
        className={cn(
          "flex-1 flex items-start justify-between gap-3 mb-4 p-4 rounded-lg transition-all shadow-warm-sm",
          isCurrent && "ring-1",
          isPast && !isCompleted && "opacity-50"
        )}
        style={{
          background: isCurrent ? `${color}12` : "var(--bg-elevated)",
          border: `1px solid ${isCurrent ? `${color}40` : "var(--border-subtle)"}`,
          opacity: isCompleted ? 0.6 : undefined,
        }}
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Time + labels */}
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span
              className="type-time-data flex items-center gap-1"
              style={{
                color: isCurrent ? color : "var(--text-secondary)",
              }}
            >
              <Clock size={11} />
              {timeDisplay}
            </span>
            {duration && (
              <Badge variant="default" className="text-[10px]">
                {duration}
              </Badge>
            )}
            {isCurrent && (
              <Badge variant="success" className="text-[10px]">
                Now
              </Badge>
            )}
            {isUpcoming && !isCurrent && (
              <Badge variant="info" className="text-[10px]">
                Up next
              </Badge>
            )}
          </div>

          {/* Title */}
          <p
            className="type-habit-name"
            style={{
              color: "var(--text-primary)",
              textDecoration: isCompleted ? "line-through" : "none",
            }}
          >
            {habit.title}
          </p>

          {/* Description */}
          {habit.description && (
            <p
              className="text-xs mt-0.5 truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {habit.description}
            </p>
          )}

          {/* Streak badge */}
          <div className="mt-2">
            <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
          </div>
        </div>

        {/* Completion toggle */}
        <HabitCompletionButton
          isCompleted={isCompleted}
          onToggle={toggle}
          color={color}
          size="md"
        />
      </div>
    </div>
  );
}
