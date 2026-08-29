"use client";

import { Flame } from "lucide-react";

interface StreakRibbonProps {
  count: number;
  className?: string;
  /** Override the default tooltip. Defaults to "{count}-day streak". */
  title?: string;
  compact?: boolean;
}

export function StreakRibbon({ count, className = "", title, compact = false }: StreakRibbonProps) {
  if (count < 1) return null;

  const label = title ?? `${count}-day streak`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold select-none transition-all duration-200 flex-shrink-0 shadow-xs group ${className}`}
      title={label}
      aria-label={label}
      style={{
        background: "color-mix(in srgb, var(--accent) 14%, var(--bg-elevated))",
        color: "var(--accent)",
        border: "1px solid color-mix(in srgb, var(--accent) 28%, transparent)",
      }}
    >
      <Flame
        size={compact ? 12 : 13}
        className="fill-[var(--accent)] text-[var(--accent)] transition-transform group-hover:scale-110"
      />
      <span
        className="font-semibold tracking-tight"
        style={{
          fontFamily: "var(--font-sans)",
          lineHeight: 1,
        }}
      >
        {count}
        <span className="text-[10px] font-normal opacity-80 ml-0.5">d</span>
      </span>
    </span>
  );
}
