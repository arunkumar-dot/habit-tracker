"use client";

import { DURATIONS, type PomodoroMode } from "@/hooks/use-pomodoro";

const MODE_COLORS: Record<PomodoroMode, string> = {
  focus: "#6366f1",       // --accent-primary
  shortBreak: "#10b981",  // --accent-success
  longBreak: "#3b82f6",   // --accent-info
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

  // SVG ring
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-56 h-56">
        {/* Background track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.4s ease" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className="text-5xl font-bold tabular-nums tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {formatTime(Math.ceil(remainingSecs))}
          </span>
          <span className="text-xs font-medium" style={{ color }}>
            {isRunning ? "● Focus" : remainingSecs === DURATIONS[mode] ? "Ready" : "Paused"}
          </span>
        </div>

        {/* Pulse ring when running */}
        {isRunning && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-10"
            style={{ background: color }}
          />
        )}
      </div>
    </div>
  );
}
