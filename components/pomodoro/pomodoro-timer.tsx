"use client";

import { DURATIONS, type PomodoroMode } from "@/hooks/use-pomodoro";

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
            stroke="var(--bg-sunken)"
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
            className="tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "96px",
              fontWeight: 400,
              lineHeight: 1,
              color: "var(--text-primary)",
            }}
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
