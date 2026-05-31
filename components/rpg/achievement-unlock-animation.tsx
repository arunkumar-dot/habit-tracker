"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  motionDurations,
  motionEasings,
  motionStaggers,
} from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface AchievementUnlockAnimationProps {
  title: string;
  xp?: number;
  active?: boolean;
  className?: string;
}

export function AchievementUnlockAnimation({
  title,
  xp,
  active = true,
  className,
}: AchievementUnlockAnimationProps) {
  const { shouldReduceMotion } = useMotionPreference();

  if (!active) return null;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-lg border border-[var(--stellar-gold)] bg-[var(--stellar-gold-soft)] px-4 py-3 text-[var(--text-primary)] shadow-[var(--glow-gold)]",
        className
      )}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : motionDurations.xpFloat,
        ease: motionEasings.reward,
        ...motionStaggers.reward,
      }}
      style={{ willChange: shouldReduceMotion ? undefined : "transform, opacity" }}
    >
      <p className="type-stat-label text-[var(--stellar-gold)]">Achievement unlocked</p>
      <p className="type-quest-title">{title}</p>
      {typeof xp === "number" && (
        <p className="type-xp mt-1 text-[var(--stellar-gold)]">+{xp} XP</p>
      )}
    </motion.div>
  );
}
