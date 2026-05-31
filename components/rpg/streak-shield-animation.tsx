"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motionDurations, motionEasings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface StreakShieldAnimationProps {
  active?: boolean;
  className?: string;
  children?: ReactNode;
}

export function StreakShieldAnimation({
  active = true,
  className,
  children,
}: StreakShieldAnimationProps) {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <motion.div
      className={cn(
        "relative inline-grid place-items-center rounded-full border border-[var(--ember-orange)] text-[var(--ember-orange)]",
        active && !shouldReduceMotion && "rpg-shield-pulse",
        className
      )}
      animate={
        active && !shouldReduceMotion
          ? { scale: [1, 1.06, 1], opacity: [1, 0.96, 1] }
          : undefined
      }
      transition={{
        duration: motionDurations.shieldPulse,
        ease: motionEasings.standard,
      }}
      style={{ willChange: active && !shouldReduceMotion ? "transform, opacity" : undefined }}
    >
      {children}
    </motion.div>
  );
}
