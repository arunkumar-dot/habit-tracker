"use client";

import { motion } from "framer-motion";

interface PomodoroAudioVisualizerProps {
  isActive: boolean;
  color?: string;
  size?: number;
}

export function PomodoroAudioVisualizer({
  isActive,
  color = "var(--accent)",
  size = 320,
}: PomodoroAudioVisualizerProps) {
  if (!isActive) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-visible"
      style={{ width: size, height: size }}
    >
      {/* Wave Ripple 1 */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1.45],
          opacity: [0.45, 0.2, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute rounded-full border border-[var(--accent)]"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          borderColor: color,
          boxShadow: `0 0 20px color-mix(in srgb, ${color} 30%, transparent)`,
        }}
      />

      {/* Wave Ripple 2 (Offset Phase) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1.55],
          opacity: [0.4, 0.15, 0],
        }}
        transition={{
          duration: 2.4,
          delay: 0.8,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute rounded-full border border-[var(--accent)]"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          borderColor: color,
        }}
      />

      {/* Wave Ripple 3 (Offset Phase) */}
      <motion.div
        animate={{
          scale: [1, 1.35, 1.65],
          opacity: [0.35, 0.1, 0],
        }}
        transition={{
          duration: 2.4,
          delay: 1.6,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute rounded-full border border-[var(--accent)]"
        style={{
          width: size * 0.78,
          height: size * 0.78,
          borderColor: color,
        }}
      />

      {/* Ambient Breathing Audio Ring */}
      <motion.div
        animate={{
          scale: [0.98, 1.05, 0.98],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute rounded-full blur-md"
        style={{
          width: size * 0.88,
          height: size * 0.88,
          background: `radial-gradient(circle, transparent 65%, color-mix(in srgb, ${color} 25%, transparent) 90%, transparent 100%)`,
        }}
      />
    </div>
  );
}
