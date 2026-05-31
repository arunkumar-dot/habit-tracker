"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionDurations, motionEasings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface XPFloatProps {
  amount: number;
  show?: boolean;
  className?: string;
}

export function XPFloat({ amount, show = true, className }: XPFloatProps) {
  const { shouldReduceMotion } = useMotionPreference();

  if (!show) return null;

  return (
    <motion.span
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute z-20 rounded-full px-2 py-1 font-[var(--font-rpg)] text-sm font-bold text-[var(--stellar-gold)]",
        "bg-[var(--stellar-gold-soft)] shadow-[var(--glow-gold)]",
        className
      )}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.96 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: -28, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -42, scale: 0.98 }}
      transition={{
        duration: shouldReduceMotion ? motionDurations.fast : motionDurations.xpFloat,
        ease: motionEasings.reward,
      }}
      style={{ willChange: shouldReduceMotion ? undefined : "transform, opacity" }}
    >
      +{amount} XP
    </motion.span>
  );
}
