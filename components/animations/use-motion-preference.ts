"use client";

import { useReducedMotion } from "framer-motion";

export function useMotionPreference() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion: Boolean(prefersReducedMotion),
    shouldReduceMotion: Boolean(prefersReducedMotion),
  };
}
