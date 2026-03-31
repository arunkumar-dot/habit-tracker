"use client";

import { cn } from "@/lib/utils";
import { MODE_LABELS, type PomodoroMode } from "@/hooks/use-pomodoro";

const MODES: PomodoroMode[] = ["focus", "shortBreak", "longBreak"];

interface ModeSelectorProps {
  mode: PomodoroMode;
  onSwitch: (mode: PomodoroMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ mode, onSwitch, disabled }: ModeSelectorProps) {
  return (
    <div
      className="flex gap-1 p-1 rounded-xl"
      style={{ background: "var(--bg-elevated)" }}
    >
      {MODES.map((m) => (
        <button
          key={m}
          onClick={() => !disabled && onSwitch(m)}
          disabled={disabled}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            disabled && "cursor-not-allowed opacity-60"
          )}
          style={
            mode === m
              ? {
                  background: "var(--accent-primary)",
                  color: "white",
                  boxShadow: "0 2px 8px color-mix(in srgb, var(--accent-primary) 40%, transparent)",
                }
              : {
                  color: "var(--text-secondary)",
                  background: "transparent",
                }
          }
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
}
