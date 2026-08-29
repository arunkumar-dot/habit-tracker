"use client";

import { motion } from "framer-motion";
import { DURATIONS, type PomodoroMode } from "@/hooks/use-pomodoro";
import { ThreeFocusOrb } from "@/components/3d/three-focus-orb";

// All modes use --accent; the mode label provides semantic distinction
const MODE_COLORS: Record<PomodoroMode, string> = {
  focus:      "var(--accent)",
  shortBreak: "var(--success)",
  longBreak:  "var(--habit-4)",
};

interface PomodoroTimerProps {
  mode: PomodoroMode;
  remainingSecs: number;
  isRunning: boolean;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function PomodoroTimer({ mode, remainingSecs, isRunning }: PomodoroTimerProps) {
  const color = MODE_COLORS[mode];
  const total = DURATIONS[mode];
  const progress = remainingSecs / total; // 1 → 0

  // SVG ring dimensions
  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex items-center justify-center p-2 relative">
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Background 3D Focus Orb */}
        <div className="absolute inset-0 flex items-center justify-center opacity-75">
          <ThreeFocusOrb mode={mode} isRunning={isRunning} size={280} />
        </div>

        {/* Background track & Progress arc */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-10"
          viewBox="0 0 240 240"
        >
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke="color-mix(in srgb, var(--border-default) 40%, transparent)"
            strokeWidth="6"
          />
          <circle
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 200ms ease, stroke 200ms ease",
              filter: `drop-shadow(0 0 8px color-mix(in srgb, ${color} 40%, transparent))`,
            }}
          />
        </svg>

        {/* Center content with frosted glass backdrop */}
        <div
          className="absolute inset-8 rounded-full flex flex-col items-center justify-center select-none z-10"
          style={{
            background: "color-mix(in srgb, var(--bg-elevated) 45%, transparent)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
          }}
        >
          <motion.span
            key={formatTime(Math.ceil(remainingSecs))}
            initial={{ scale: 0.96, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="tabular-nums tracking-tight font-normal"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "64px",
              lineHeight: 1,
              color: "var(--text-primary)",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {formatTime(Math.ceil(remainingSecs))}
          </motion.span>
          <span
            className="text-xs font-semibold uppercase tracking-wider mt-2.5 px-3.5 py-0.5 rounded-full"
            style={{
              color,
              background: "color-mix(in srgb, currentColor 14%, transparent)",
              border: "1px solid color-mix(in srgb, currentColor 20%, transparent)",
            }}
          >
            {isRunning
              ? mode === "focus"
                ? "● Deep Focus"
                : "● Rest & Recharge"
              : remainingSecs === DURATIONS[mode]
                ? "Ready"
                : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
}
