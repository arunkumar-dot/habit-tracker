"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  cardMotionVariants,
  motionDurations,
  motionEasings,
  motionSprings,
} from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
}

export function AnimatedCard({
  className,
  interactive = true,
  children,
  ...props
}: AnimatedCardProps) {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <motion.div
      className={cn(
        "rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]",
        interactive && "transition-colors hover:border-[var(--border-default)]",
        className
      )}
      variants={shouldReduceMotion ? undefined : cardMotionVariants}
      initial={shouldReduceMotion ? false : "initial"}
      animate={shouldReduceMotion ? undefined : "animate"}
      exit={shouldReduceMotion ? undefined : "exit"}
      whileHover={
        interactive && !shouldReduceMotion
          ? { y: -2, transition: motionSprings.gentle }
          : undefined
      }
      transition={{
        duration: motionDurations.card,
        ease: motionEasings.standard,
      }}
      style={{ willChange: shouldReduceMotion ? undefined : "transform, opacity" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
