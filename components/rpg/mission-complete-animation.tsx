"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionDurations, motionEasings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface MissionCompleteAnimationProps {
  active?: boolean;
  className?: string;
}

export function MissionCompleteAnimation({
  active = true,
  className,
}: MissionCompleteAnimationProps) {
  const { shouldReduceMotion } = useMotionPreference();

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-lg border border-[var(--success)] bg-[var(--success-soft)]",
        "rpg-quest-complete",
        className
      )}
      initial={{ opacity: shouldReduceMotion ? 0.16 : 0 }}
      animate={{ opacity: shouldReduceMotion ? 0.16 : [0, 0.32, 0] }}
      transition={{
        duration: shouldReduceMotion ? 0 : motionDurations.questComplete,
        ease: motionEasings.standard,
      }}
      style={{ willChange: shouldReduceMotion ? undefined : "opacity" }}
    />
  );
}
