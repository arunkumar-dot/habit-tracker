"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Clock, Check, Pencil } from "lucide-react";
import { HabitGoalProgress } from "@/components/retention/habit-goal-progress";
import { HabitMenu } from "./habit-menu";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { formatDisplayTime, formatDuration, getDurationMinutes } from "@/lib/time-utils";
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

  // Swipe tint background
  const cardBackground = useTransform(dragX,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    ["rgba(239,68,68,0.08)", "rgba(0,0,0,0)", "rgba(16,185,129,0.10)"]
  );
  const rightOpacity = useTransform(dragX, [0, SWIPE_THRESHOLD * 0.5, SWIPE_THRESHOLD], [0, 0.5, 1]);
  const leftOpacity  = useTransform(dragX, [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 0.5, 0], [1, 0.5, 0]);

  const timeLabel = habit.endTime
    ? `${formatDisplayTime(habit.startTime)} – ${formatDisplayTime(habit.endTime)}`
    : formatDisplayTime(habit.startTime);

  const duration = habit.endTime
    ? formatDuration(getDurationMinutes(habit.startTime, habit.endTime))
    : null;

  return (
    // No border-radius, no shadow, no full border — reads as a list row
    <div
      className="relative overflow-hidden transition-colors hover:bg-[var(--bg-hover)]"
      style={{ borderBottom: "1px solid var(--border-default)" }}
    >
      {/* Swipe tint */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: cardBackground }} />

      {/* Right swipe hint — Complete */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1"
        style={{ opacity: rightOpacity }}
      >
        <span className="text-xs font-semibold" style={{ color: "#10b981" }}>Complete</span>
        <Check size={16} style={{ color: "#10b981" }} />
      </motion.div>

      {/* Left swipe hint — Edit */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1"
        style={{ opacity: leftOpacity }}
      >
        <Pencil size={16} style={{ color: "#f59e0b" }} />
        <span className="text-xs font-semibold" style={{ color: "#f59e0b" }}>Edit</span>
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
        className="relative flex items-start gap-3 px-5 py-3.5"
      >
        {/* 8px habit-color dot — aligned with first line of text */}
        <div
          className="flex-shrink-0 mt-[7px]"
          style={{ width: 8, height: 8, borderRadius: "50%", background: color }}
        />

        {/* Text content */}
        <div className="flex-1 min-w-0">
          {/* Habit name — dims when done, never struck through */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 500,
              color: isCompleted ? "var(--text-secondary)" : "var(--text-primary)",
              lineHeight: 1.4,
            }}
          >
            {habit.title}
          </p>

          {habit.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-tertiary)" }}>
              {habit.description}
            </p>
          )}

          {/* Meta row — single muted line: 🕐 time · duration · frequency */}
          <div
            className="flex items-center gap-1 mt-1 flex-wrap"
            style={{ color: "var(--text-tertiary)", fontSize: 13 }}
          >
            <Clock size={12} style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-mono)" }}>{timeLabel}</span>
            {duration && (
              <>
                <span aria-hidden="true">·</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>{duration}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{habit.frequency === "daily" ? "Daily" : "Weekly"}</span>
          </div>

          {habit.weeklyGoal && (
            <HabitGoalProgress habitId={habit._id} weeklyGoal={habit.weeklyGoal} />
          )}
        </div>

        {/* Right side: menu + completion circle */}
        <div className="flex items-center gap-2 self-center flex-shrink-0">
          <HabitMenu habit={habit} onEdit={onEdit} />

          {/* 20px completion circle — text-primary fill when done, border-strong when not */}
          <button
            onClick={(e) => { e.stopPropagation(); void toggle(); }}
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={
              isCompleted
                ? {
                    // Spec: filled var(--text) at 90% opacity, white check, calm not loud
                    background: "color-mix(in srgb, var(--text-primary) 90%, transparent)",
                    border: "none",
                  }
                : {
                    background: "transparent",
                    border: "1.5px solid var(--border-strong)",
                  }
            }
          >
            {isCompleted && (
              // color: --bg-elevated = white in light, near-dark in dark — always contrasts with text-primary fill
              <Check size={12} strokeWidth={2.5} style={{ color: "var(--bg-elevated)" }} />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
