"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionDurations, motionEasings } from "@/components/animations";
import { useMotionPreference } from "@/components/animations";

interface XPBarProps {
  value: number;
  max: number;
  className?: string;
}

export function XPBar({ value, max, className }: XPBarProps) {
  const { shouldReduceMotion } = useMotionPreference();
  const percent = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;

  return (
    <div
      className={cn("h-3 overflow-hidden rounded-full bg-[rgba(2,6,23,0.38)]", className)}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="XP progress"
    >
      <motion.div
        className="h-full w-full origin-left rounded-full"
        style={{
          background: "var(--grad-xp)",
          boxShadow: "var(--glow-purple)",
          willChange: shouldReduceMotion ? undefined : "transform",
        }}
        initial={shouldReduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: percent / 100 }}
        transition={{
          duration: shouldReduceMotion ? 0 : motionDurations.xpFloat,
          ease: motionEasings.standard,
        }}
      />
    </div>
  );
}
