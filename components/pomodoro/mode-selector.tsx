"use client";

import { motion } from "framer-motion";
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
      className={cn(
        "glass-panel flex p-1.5 rounded-2xl gap-1.5",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      {MODES.map((m) => {
        const isActive = mode === m;
        return (
          <motion.button
            key={m}
            whileTap={{ scale: 0.96 }}
            onClick={() => !disabled && onSwitch(m)}
            disabled={disabled}
            className="relative flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors z-10"
            style={{
              color: isActive ? "#ffffff" : "var(--text-secondary)",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="pomodoroModeActivePill"
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    m === "focus"
                      ? "var(--accent)"
                      : m === "shortBreak"
                        ? "var(--success)"
                        : "var(--habit-4)",
                  boxShadow:
                    m === "focus"
                      ? "0 4px 14px -2px color-mix(in srgb, var(--accent) 45%, transparent)"
                      : m === "shortBreak"
                        ? "0 4px 14px -2px color-mix(in srgb, var(--success) 45%, transparent)"
                        : "0 4px 14px -2px color-mix(in srgb, var(--habit-4) 45%, transparent)",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{MODE_LABELS[m]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
