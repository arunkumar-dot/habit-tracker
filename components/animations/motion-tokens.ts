"use client";

import type { Variants } from "framer-motion";

export const motionDurations = {
  instant: 0.08,
  fast: 0.15,
  base: 0.2,
  card: 0.24,
  questComplete: 0.4,
  shieldPulse: 0.6,
  xpFloat: 0.8,
  levelUp: 1.5,
  glowBreathe: 3,
  starTwinkle: 4,
} as const;

export const motionEasings = {
  standard: [0.22, 1, 0.36, 1],
  emphasized: [0.16, 1, 0.3, 1],
  reward: [0.34, 1.56, 0.64, 1],
  exit: [0.4, 0, 1, 1],
} as const;

export const motionSprings = {
  gentle: { type: "spring", stiffness: 220, damping: 26, mass: 0.9 },
  responsive: { type: "spring", stiffness: 340, damping: 30, mass: 0.8 },
  reward: { type: "spring", stiffness: 420, damping: 18, mass: 0.7 },
  overlay: { type: "spring", stiffness: 180, damping: 22, mass: 1 },
} as const;

export const motionStaggers = {
  tight: { staggerChildren: 0.035, delayChildren: 0.02 },
  list: { staggerChildren: 0.055, delayChildren: 0.04 },
  reward: { staggerChildren: 0.08, delayChildren: 0.08 },
} as const;

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const cardMotionVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 6, scale: 0.98 },
};

export const floatingCardVariants: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};
