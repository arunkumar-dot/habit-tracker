"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  floatingCardVariants,
  motionDurations,
  motionEasings,
  motionSprings,
} from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface FloatingCardProps extends HTMLMotionProps<"div"> {
  glow?: "none" | "purple" | "gold" | "health" | "streak";
}

const glowClass = {
  none: "",
  purple: "shadow-[var(--glow-purple)]",
  gold: "shadow-[var(--glow-gold)]",
  health: "shadow-[var(--glow-health)]",
  streak: "shadow-[var(--glow-streak)]",
};

export function FloatingCard({
  className,
  glow = "purple",
  children,
  ...props
}: FloatingCardProps) {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <motion.div
      className={cn(
        "glass-panel rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)]",
        glowClass[glow],
        !shouldReduceMotion && "rpg-glow-breathe",
        className
      )}
      variants={shouldReduceMotion ? undefined : floatingCardVariants}
      initial={shouldReduceMotion ? false : "initial"}
      animate={shouldReduceMotion ? undefined : "animate"}
      exit={shouldReduceMotion ? undefined : "exit"}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -3, scale: 1.01, transition: motionSprings.gentle }
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
