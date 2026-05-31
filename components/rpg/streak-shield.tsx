"use client";

import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreakShieldAnimation } from "@/components/rpg/streak-shield-animation";

interface StreakShieldProps {
  streak: number;
  className?: string;
}

function shieldLabel(streak: number): string {
  if (streak >= 30) return "Aegis shield";
  if (streak >= 14) return "Triple shield";
  if (streak >= 7) return "Double shield";
  if (streak >= 3) return "Charged shield";
  if (streak >= 1) return "Shield forming";
  return "No shield";
}

export function StreakShield({ streak, className }: StreakShieldProps) {
  const active = streak >= 7;

  return (
    <StreakShieldAnimation
      active={active}
      className={cn(
        "min-h-11 min-w-11 px-3 py-2",
        streak >= 14 && "border-[var(--stellar-gold)] text-[var(--stellar-gold)]",
        streak >= 30 && "shadow-[var(--glow-gold)]",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Shield size={18} strokeWidth={2.2} aria-hidden="true" />
        <div className="leading-none">
          <p className="type-stat-label text-current">{shieldLabel(streak)}</p>
          <p className="font-[var(--font-rpg)] text-sm font-bold text-[var(--text-primary)]">
            {streak}d
          </p>
        </div>
      </div>
    </StreakShieldAnimation>
  );
}
