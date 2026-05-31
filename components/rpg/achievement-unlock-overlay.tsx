"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sprout, Flame, Zap, Medal, Trophy, Star, Gem, type LucideProps } from "lucide-react";
import { AchievementBadge } from "./achievement-badge";
import { motionDurations, motionEasings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";
import type { MilestoneTier, MilestoneIconName } from "@/lib/milestone-config";

const ICON_MAP: Record<MilestoneIconName, React.FC<LucideProps>> = {
  Sprout, Flame, Zap, Medal, Trophy, Star, Gem,
};

export interface AchievementOverlayData {
  name: string;
  description: string;
  icon: MilestoneIconName;
  tier: MilestoneTier;
  xp: number;
}

interface AchievementUnlockOverlayProps {
  achievement: AchievementOverlayData | null;
  onDismiss: () => void;
}

export function AchievementUnlockOverlay({ achievement, onDismiss }: AchievementUnlockOverlayProps) {
  const { shouldReduceMotion } = useMotionPreference();
  const Icon = achievement ? (ICON_MAP[achievement.icon] ?? Star) : Star;

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          role="status"
          aria-live="assertive"
          className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,6,23,0.78)] px-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : motionDurations.card }}
          onClick={onDismiss}
        >
          <motion.div
            className="relative w-full max-w-xs rounded-2xl border border-[var(--stellar-gold)] bg-[var(--space-elevated)] px-8 py-7 text-center shadow-[var(--glow-gold)]"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.82, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{
              duration: shouldReduceMotion ? 0 : motionDurations.levelUp * 0.55,
              ease: motionEasings.reward,
            }}
            style={{ willChange: shouldReduceMotion ? undefined : "transform, opacity" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="type-stat-label mb-3 text-[var(--stellar-gold)]">Achievement Unlocked</p>

            {/* Icon badge */}
            <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border border-[var(--stellar-gold)] bg-[var(--stellar-gold-soft)] shadow-[var(--glow-gold)]">
              <Icon size={36} style={{ color: "var(--stellar-gold)" }} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <AchievementBadge tier={achievement.tier} className="mb-3" />

            <h2 className="type-quest-title mb-1 text-[var(--comet-white)]">{achievement.name}</h2>
            <p className="text-sm text-[var(--stardust)]">{achievement.description}</p>

            <p className="type-xp mt-5 text-[var(--stellar-gold)]">+{achievement.xp} XP</p>
            <p className="mt-4 text-xs text-[var(--asteroid)]">Tap to dismiss</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
