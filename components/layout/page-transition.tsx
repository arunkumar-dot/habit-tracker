"use client";

import { motion } from "framer-motion";

/**
 * Wraps page content with a subtle fade-up entrance animation.
 * Place inside the dashboard layout around {children}.
 * Each new page mount triggers the animation independently.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
}
