"use client";

import { Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface StreakShieldProps {
  streak: number;
  className?: string;
}

type ShieldTier = 0 | 1 | 2 | 3 | 4 | 5;

function getTier(streak: number): ShieldTier {
  if (streak <= 0)  return 0;
  if (streak <= 2)  return 1;
  if (streak <= 6)  return 2;
  if (streak <= 13) return 3;
  if (streak <= 29) return 4;
  return 5;
}

const TIER_LABEL  = ["No shield", "Shield forming", "Charged shield", "Glowing shield", "Enhanced shield", "Aegis shield"] as const;
const TIER_COLOR  = ["transparent", "var(--asteroid)", "var(--stardust)", "var(--ember-orange)", "var(--stellar-gold)", "var(--nebula-purple)"] as const;
const TIER_GLOW   = ["none", "none", "none", "var(--glow-streak)", "var(--glow-gold)", "var(--glow-purple)"] as const;

export function StreakShield({ streak, className }: StreakShieldProps) {
  const { shouldReduceMotion } = useMotionPreference();
  const tier = getTier(streak);

  if (tier === 0) return null;

  const color = TIER_COLOR[tier];
  const glow  = TIER_GLOW[tier];
  const label = TIER_LABEL[tier];

  const animClass = !shouldReduceMotion
    ? tier === 3
      ? "rpg-glow-breathe"
      : tier === 4
        ? "rpg-shield-pulse"
        : ""
    : "";

  return (
    <div
      role="img"
      aria-label={`${label}: ${streak}-day streak`}
      className={cn(
        "relative inline-flex min-h-11 min-w-11 items-center gap-2 rounded-full border px-3 py-2",
        animClass,
        className
      )}
      style={{
        color,
        borderColor: tier === 1
          ? `color-mix(in srgb, ${color} 35%, transparent)`
          : `color-mix(in srgb, ${color} 55%, transparent)`,
        background: tier === 1
          ? "transparent"
          : `color-mix(in srgb, ${color} ${tier <= 2 ? 8 : 13}%, transparent)`,
        boxShadow: glow !== "none" ? glow : undefined,
        opacity: tier === 1 ? 0.55 : 1,
      }}
    >
      {/* Rotating outer ring for legendary (30+) tier */}
      {tier === 5 && !shouldReduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-3px] rounded-full border border-[var(--stellar-gold)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        />
      )}

      <Shield
        size={18}
        strokeWidth={tier >= 4 ? 2 : 2.2}
        aria-hidden="true"
      />
      <div className="leading-none">
        <p className="type-stat-label text-current">{label}</p>
        <p className="font-[var(--font-rpg)] text-sm font-bold text-[var(--text-primary)]">
          {streak}d
        </p>
      </div>
    </div>
  );
}
