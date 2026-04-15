"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Clock, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HabitCompletionButton } from "./habit-completion-button";
import { HabitStreakBadge } from "./habit-streak-badge";
import { HabitMilestoneHint } from "./habit-milestone-hint";
import { HabitGoalProgress } from "@/components/retention/habit-goal-progress";
import { HabitMenu } from "./habit-menu";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { formatDisplayTime, formatDuration, getDurationMinutes } from "@/lib/date-utils";
import type { Habit } from "@/types";

interface HabitCardProps {
  habit: Habit;
  date: string;
  onEdit: (habit: Habit) => void;
}

const SWIPE_THRESHOLD = 72;

export function HabitCard({ habit, date, onEdit }: HabitCardProps) {
  const { isCompleted, toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "#6366f1";
  const dragX = useMotionValue(0);
  const isSwiping = useRef(false);

  // Background tint based on drag direction
  const cardBackground = useTransform(
    dragX,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    [
      "rgba(239,68,68,0.08)",
      "transparent",
      "rgba(16,185,129,0.10)",
    ]
  );

  // Swipe hint icon opacity
  const rightOpacity = useTransform(dragX, [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD], [0, 0.5, 1]);
  const leftOpacity = useTransform(dragX, [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0], [1, 0.5, 0]);

  const timeLabel = habit.endTime
    ? `${formatDisplayTime(habit.startTime)} – ${formatDisplayTime(habit.endTime)}`
    : formatDisplayTime(habit.startTime);

  const duration =
    habit.endTime
      ? formatDuration(getDurationMinutes(habit.startTime, habit.endTime))
      : null;

  return (
    <motion.div
      // Mount animation
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      // Hover lift
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="relative rounded-lg overflow-hidden shadow-warm-sm card-hoverable"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
    >
      {/* Swipe hint background */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: cardBackground }}
      />

      {/* Right swipe hint — Complete */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1"
        style={{ opacity: rightOpacity }}
      >
        <span className="text-xs font-semibold" style={{ color: "#10b981" }}>Complete</span>
        <span className="text-lg">✓</span>
      </motion.div>

      {/* Left swipe hint — Edit */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1"
        style={{ opacity: leftOpacity }}
      >
        <span className="text-lg">✏️</span>
        <span className="text-xs font-semibold" style={{ color: "#f59e0b" }}>Edit</span>
      </motion.div>

      {/* Draggable card surface */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragDirectionLock
        style={{ x: dragX, opacity: isCompleted ? 0.75 : 1, cursor: "grab" }}
        onDragStart={() => { isSwiping.current = true; }}
        onDragEnd={(_, info) => {
          isSwiping.current = false;
          if (info.offset.x > SWIPE_THRESHOLD && !isCompleted) {
            void toggle();
          } else if (info.offset.x < -SWIPE_THRESHOLD) {
            onEdit(habit);
          }
        }}
        className="relative flex items-start gap-2.5 px-4 py-3.5"
      >
        {/* 8px category color dot — replaces the left color bar */}
        <div
          className="flex-shrink-0 mt-[7px]"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: color,
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <motion.p
                className="type-habit-name leading-snug"
                animate={{
                  opacity: isCompleted ? 0.55 : 1,
                }}
                transition={{ duration: 0.25 }}
                style={{
                  color: "var(--text-primary)",
                  textDecoration: isCompleted ? "line-through" : "none",
                }}
              >
                {habit.title}
              </motion.p>
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
              className="type-time-data flex items-center gap-1"
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
            <HabitMilestoneHint habitId={habit._id} frequency={habit.frequency} />
          </div>
          {habit.weeklyGoal && (
            <HabitGoalProgress habitId={habit._id} weeklyGoal={habit.weeklyGoal} />
          )}
        </div>

        {/* Completion toggle */}
        <div className="flex-shrink-0 mt-1 relative">
          <HabitCompletionButton
            isCompleted={isCompleted}
            onToggle={toggle}
            color={color}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
