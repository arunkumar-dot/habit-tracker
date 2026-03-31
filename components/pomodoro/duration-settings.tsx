"use client";

import { useState } from "react";
import { Settings2, ChevronDown, ChevronUp } from "lucide-react";
import { MODE_LABELS, type PomodoroMode } from "@/hooks/use-pomodoro";

const MODES: PomodoroMode[] = ["focus", "shortBreak", "longBreak"];
const MIN_MINUTES = 1;
const MAX_MINUTES = 120;

interface DurationSettingsProps {
  durations: Record<PomodoroMode, number>;
  onSetDuration: (mode: PomodoroMode, minutes: number) => void;
  disabled?: boolean;
}

export function DurationSettings({ durations, onSetDuration, disabled }: DurationSettingsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      {/* Toggle row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:brightness-110"
      >
        <div className="flex items-center gap-2">
          <Settings2 size={15} style={{ color: "var(--text-secondary)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Timer Durations
          </span>
        </div>
        {open ? (
          <ChevronUp size={15} style={{ color: "var(--text-disabled)" }} />
        ) : (
          <ChevronDown size={15} style={{ color: "var(--text-disabled)" }} />
        )}
      </button>

      {/* Expandable content */}
      {open && (
        <div
          className="px-4 pb-4 flex flex-col gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p className="text-xs mt-3" style={{ color: "var(--text-disabled)" }}>
            Changes take effect immediately when the timer is not running.
          </p>

          {MODES.map((m) => {
            const minutes = Math.round(durations[m] / 60);
            return (
              <div key={m} className="flex items-center justify-between gap-4">
                <label
                  className="text-sm flex-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {MODE_LABELS[m]}
                </label>

                <div className="flex items-center gap-2">
                  <button
                    disabled={disabled || minutes <= MIN_MINUTES}
                    onClick={() => onSetDuration(m, minutes - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-colors disabled:opacity-30"
                    style={{
                      background: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                    }}
                    aria-label={`Decrease ${MODE_LABELS[m]} duration`}
                  >
                    −
                  </button>

                  <span
                    className="w-14 text-center text-sm font-semibold tabular-nums"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {minutes} min
                  </span>

                  <button
                    disabled={disabled || minutes >= MAX_MINUTES}
                    onClick={() => onSetDuration(m, minutes + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-colors disabled:opacity-30"
                    style={{
                      background: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                    }}
                    aria-label={`Increase ${MODE_LABELS[m]} duration`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
