"use client";

import { useState, useEffect } from "react";
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

function DurationRow({
  mode,
  durationSecs,
  onSetDuration,
  disabled,
}: {
  mode: PomodoroMode;
  durationSecs: number;
  onSetDuration: (mode: PomodoroMode, minutes: number) => void;
  disabled?: boolean;
}) {
  const currentMinutes = Math.round(durationSecs / 60);
  const [inputValue, setInputValue] = useState(String(currentMinutes));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(String(currentMinutes));
    }
  }, [currentMinutes, isFocused]);

  const commitValue = (val: string) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      setInputValue(String(currentMinutes));
      return;
    }
    const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, parsed));
    setInputValue(String(clamped));
    if (clamped !== currentMinutes) {
      onSetDuration(mode, clamped);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setInputValue(String(currentMinutes));
      e.currentTarget.blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(MAX_MINUTES, currentMinutes + 1);
      setInputValue(String(next));
      onSetDuration(mode, next);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(MIN_MINUTES, currentMinutes - 1);
      setInputValue(String(next));
      onSetDuration(mode, next);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label
        htmlFor={`duration-input-${mode}`}
        className="text-sm flex-1 cursor-pointer"
        style={{ color: "var(--text-primary)" }}
      >
        {MODE_LABELS[mode]}
      </label>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={disabled || currentMinutes <= MIN_MINUTES}
          onClick={() => {
            const next = Math.max(MIN_MINUTES, currentMinutes - 1);
            setInputValue(String(next));
            onSetDuration(mode, next);
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30 hover:brightness-110 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-secondary)",
          }}
          aria-label={`Decrease ${MODE_LABELS[mode]} duration`}
        >
          −
        </button>

        {/* Clickable direct number input box */}
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-lg border transition-all"
          style={{
            background: "var(--bg-elevated)",
            borderColor: isFocused ? "var(--accent)" : "var(--border)",
            boxShadow: isFocused
              ? "0 0 0 2px color-mix(in srgb, var(--accent) 25%, transparent)"
              : "none",
          }}
        >
          <input
            id={`duration-input-${mode}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={disabled}
            value={inputValue}
            onFocus={(e) => {
              setIsFocused(true);
              e.target.select();
            }}
            onChange={(e) => {
              const raw = e.target.value;
              if (/^\d*$/.test(raw)) {
                setInputValue(raw);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              commitValue(inputValue);
            }}
            onKeyDown={handleKeyDown}
            className="w-9 text-center text-sm font-semibold tabular-nums bg-transparent border-none outline-none p-0 disabled:opacity-50"
            style={{
              color: "var(--text-primary)",
            }}
            aria-label={`${MODE_LABELS[mode]} duration in minutes`}
          />
          <span
            className="text-xs font-medium select-none"
            style={{ color: "var(--text-secondary)" }}
          >
            min
          </span>
        </div>

        <button
          type="button"
          disabled={disabled || currentMinutes >= MAX_MINUTES}
          onClick={() => {
            const next = Math.min(MAX_MINUTES, currentMinutes + 1);
            setInputValue(String(next));
            onSetDuration(mode, next);
          }}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-lg font-bold transition-all disabled:opacity-30 hover:brightness-110 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: "var(--bg-elevated)",
            color: "var(--text-secondary)",
          }}
          aria-label={`Increase ${MODE_LABELS[mode]} duration`}
        >
          +
        </button>
      </div>
    </div>
  );
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
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:brightness-110 cursor-pointer"
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

          {MODES.map((m) => (
            <DurationRow
              key={m}
              mode={m}
              durationSecs={durations[m]}
              onSetDuration={onSetDuration}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

