"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motionSprings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface GlowButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  tone?: "xp" | "gold" | "health" | "streak";
}

const toneClass = {
  xp: "bg-[var(--accent)] shadow-[var(--glow-purple)]",
  gold: "bg-[var(--stellar-gold)] shadow-[var(--glow-gold)]",
  health: "bg-[var(--success)] shadow-[var(--glow-health)]",
  streak: "bg-[var(--ember-orange)] shadow-[var(--glow-streak)]",
};

export function GlowButton({
  className,
  tone = "xp",
  children,
  disabled,
  ...props
}: GlowButtonProps) {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        toneClass[tone],
        !shouldReduceMotion && "rpg-glow-breathe",
        className
      )}
      disabled={disabled}
      whileHover={disabled || shouldReduceMotion ? undefined : { y: -1, scale: 1.015 }}
      whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={motionSprings.responsive}
      type="button"
      {...props}
    >
      {children}
    </motion.button>
  );
}
