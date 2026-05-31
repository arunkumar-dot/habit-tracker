"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Clock, Check, Pencil } from "lucide-react";
import { HabitGoalProgress } from "@/components/retention/habit-goal-progress";
import { HabitMenu } from "./habit-menu";
import { HabitStreakBadge } from "./habit-streak-badge";
import { HabitMilestoneHint } from "./habit-milestone-hint";
import { HabitCompletionButton } from "./habit-completion-button";
import { QuestCard } from "@/components/rpg/quest-card";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { formatDisplayTime } from "@/lib/time-utils";
import type { Habit } from "@/types";

interface HabitCardProps {
  habit: Habit;
  date: string;
  onEdit: (habit: Habit) => void;
}

const SWIPE_THRESHOLD = 72;

export function HabitCard({ habit, date, onEdit }: HabitCardProps) {
  const { isCompleted, toggle } = useOptimisticCompletion(habit._id, date);
  const color = habit.color ?? "#C2410C";
  const dragX = useMotionValue(0);
  const isSwiping = useRef(false);

  const cardBackground = useTransform(dragX,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    ["rgba(239,68,68,0.08)", "rgba(0,0,0,0)", "rgba(16,185,129,0.10)"]
  );
  const rightOpacity = useTransform(dragX, [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD], [0, 0.5, 1]);
  const leftOpacity  = useTransform(dragX, [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0], [1, 0.5, 0]);

  const timeLabel = formatDisplayTime(habit.startTime);

  return (
    <QuestCard color={color} style={isCompleted ? { opacity: 0.72 } : undefined}>
      {/* Swipe tint */}
      <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: cardBackground }} />

      {/* Right swipe hint — Complete */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 z-10"
        style={{ opacity: rightOpacity }}
      >
        <span className="text-xs font-semibold" style={{ color: "var(--plasma-green)" }}>Complete</span>
        <Check size={16} style={{ color: "var(--plasma-green)" }} />
      </motion.div>

      {/* Left swipe hint — Edit */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 z-10"
        style={{ opacity: leftOpacity }}
      >
        <Pencil size={16} style={{ color: "var(--stellar-gold)" }} />
        <span className="text-xs font-semibold" style={{ color: "var(--stellar-gold)" }}>Edit</span>
      </motion.div>

      {/* Draggable row surface */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        dragDirectionLock
        style={{ x: dragX, cursor: "grab" }}
        onDragStart={() => { isSwiping.current = true; }}
        onDragEnd={(_, info) => {
          isSwiping.current = false;
          if (info.offset.x > SWIPE_THRESHOLD && !isCompleted) void toggle();
          else if (info.offset.x < -SWIPE_THRESHOLD) onEdit(habit);
        }}
        className="relative z-20 flex items-start gap-3 px-4 py-3.5"
      >
        {/* 8px habit-color dot — aligned with first line */}
        <div
          className="flex-shrink-0 mt-[7px]"
          style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
        />

        {/* Main text content */}
        <div className="flex-1 min-w-0">
          {/* Quest title */}
          <p
            className="type-quest-title truncate"
            style={{ color: isCompleted ? "var(--stardust)" : "var(--comet-white)" }}
          >
            {habit.title}
          </p>

          {/* Time + XP row */}
          <div
            className="flex items-center gap-2 mt-1 flex-wrap"
            style={{ color: "var(--stardust)", fontSize: 12 }}
          >
            <Clock size={11} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)" }}>{timeLabel}</span>
            {habit.frequency === "weekly" && (
              <>
                <span aria-hidden="true">·</span>
                <span>Weekly</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span style={{ color: "var(--stellar-gold)", fontWeight: 600 }}>★ +10 XP</span>
          </div>

          {/* Milestone hint */}
          <div className="mt-1.5">
            <HabitMilestoneHint habitId={habit._id} frequency={habit.frequency} />
          </div>

          {/* Weekly goal progress */}
          {habit.weeklyGoal && (
            <div className="mt-1.5">
              <HabitGoalProgress habitId={habit._id} weeklyGoal={habit.weeklyGoal} />
            </div>
          )}
        </div>

        {/* Right side: streak badge + menu + completion */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0 self-start pt-0.5">
          <div className="flex items-center gap-1.5">
            <HabitStreakBadge habitId={habit._id} frequency={habit.frequency} />
            <HabitMenu habit={habit} onEdit={onEdit} />
          </div>
          <HabitCompletionButton
            isCompleted={isCompleted}
            onToggle={toggle}
            color={color}
          />
        </div>
      </motion.div>
    </QuestCard>
  );
}
