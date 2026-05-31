"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { XPFloat } from "@/components/rpg/xp-float";

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
  color = "var(--border-default)",
  size = "md",
  disabled = false,
}: HabitCompletionButtonProps) {
  const sizeClass = size === "sm" ? "w-[22px] h-[22px]" : "w-7 h-7";
  const iconSize = size === "sm" ? 12 : 16;

  const [showXP, setShowXP] = useState(false);
  const xpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleClick() {
    if (disabled) return;
    // Fire XP float when marking complete (not when unchecking)
    if (!isCompleted) {
      if (xpTimer.current) clearTimeout(xpTimer.current);
      setShowXP(true);
      xpTimer.current = setTimeout(() => setShowXP(false), 900);
    }
    await onToggle();
  }

  return (
    <div className="relative">
      {/* XP float — decorative, fires after mutation resolves */}
      <AnimatePresence>
        {showXP && (
          <XPFloat
            key="xp"
            amount={10}
            className="bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap"
          />
        )}
      </AnimatePresence>

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
                background: "var(--plasma-green)",
                border: "1.5px solid var(--plasma-green)",
              }
            : {
                background: "transparent",
                border: `1.5px solid ${color}80`,
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
                border: "1.5px solid var(--plasma-green)",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
