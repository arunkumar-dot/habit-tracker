"use client";

import { motion } from "framer-motion";
import { motionDurations, motionEasings } from "@/components/animations/motion-tokens";
import { useMotionPreference } from "@/components/animations/use-motion-preference";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 72,
  strokeWidth = 6,
  label = "Progress",
  className,
}: ProgressRingProps) {
  const { shouldReduceMotion } = useMotionPreference();
  const normalized = Math.max(0, Math.min(value / max, 1));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - normalized);

  return (
    <div
      className={className}
      role="img"
      aria-label={`${label}: ${Math.round(normalized * 100)}%`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-sunken)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{
            duration: shouldReduceMotion ? 0 : motionDurations.questComplete,
            ease: motionEasings.standard,
          }}
          style={{
            rotate: -90,
            transformOrigin: "50% 50%",
            willChange: shouldReduceMotion ? undefined : "stroke-dashoffset",
          }}
        />
      </svg>
    </div>
  );
}
