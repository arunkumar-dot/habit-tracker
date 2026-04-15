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
    <div className={cn("flex items-end gap-0", disabled && "opacity-60 pointer-events-none")}>
      {MODES.map((m) => (
        <button
          key={m}
          onClick={() => !disabled && onSwitch(m)}
          disabled={disabled}
          className="seg-btn flex-1"
          data-active={mode === m}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  );
}
