"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  motionDurations,
  motionEasings,
  pageTransitionVariants,
} from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const { shouldReduceMotion } = useMotionPreference();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={{ height: "100%" }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: motionDurations.card,
        ease: motionEasings.standard,
      }}
      style={{ height: "100%", willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
