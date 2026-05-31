"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionDurations, motionEasings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface LevelUpOverlayProps {
  level: number;
  show: boolean;
  title?: string;
  onComplete?: () => void;
  className?: string;
}

export function LevelUpOverlay({
  level,
  show,
  title = "Level Up",
  onComplete,
  className,
}: LevelUpOverlayProps) {
  const { shouldReduceMotion } = useMotionPreference();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-live="assertive"
          className={cn(
            "fixed inset-0 z-50 grid place-items-center bg-[rgba(2,6,23,0.72)] px-6 text-center backdrop-blur-md",
            "rpg-level-up",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : motionDurations.card }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className="rounded-lg border border-[var(--stellar-gold)] bg-[var(--bg-elevated)] px-8 py-7 shadow-[var(--glow-gold)]"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: shouldReduceMotion ? 0 : motionDurations.levelUp,
              ease: motionEasings.reward,
            }}
            style={{ willChange: shouldReduceMotion ? undefined : "transform, opacity" }}
          >
            <p className="type-stat-label text-[var(--stellar-gold)]">{title}</p>
            <p className="type-level text-[var(--text-primary)]">{level}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
