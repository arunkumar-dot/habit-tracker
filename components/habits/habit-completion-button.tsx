"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCompletionButtonProps {
  isCompleted: boolean;
  onToggle: () => Promise<void>;
  color?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}

export function HabitCompletionButton({
  isCompleted,
  onToggle,
  color = "#6366f1",
  size = "md",
  disabled = false,
}: HabitCompletionButtonProps) {
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSize = size === "sm" ? 12 : 16;

  async function handleClick() {
    if (disabled) return;
    await onToggle();
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      whileHover={{ scale: disabled ? 1 : 1.12 }}
      whileTap={{ scale: disabled ? 1 : 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "flex-shrink-0 rounded-full flex items-center justify-center",
        sizeClass,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={
        isCompleted
          ? {
              background: color,
              border: `2px solid ${color}`,
              boxShadow: `0 0 14px ${color}55`,
            }
          : {
              background: "transparent",
              border: `2px solid ${color}60`,
            }
      }
    >
      {/* Fill animation on complete */}
      <AnimatePresence>
        {isCompleted && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Check size={iconSize} strokeWidth={2.5} style={{ color: "white" }} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple ring on complete */}
      <AnimatePresence>
        {isCompleted && (
          <motion.span
            key="ring"
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              position: "absolute",
              borderRadius: "50%",
              width: "100%",
              height: "100%",
              border: `2px solid ${color}`,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
