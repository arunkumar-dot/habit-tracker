"use client";

import { useState } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  async function handleClick() {
    if (disabled || isAnimating) return;
    setIsAnimating(true);
    try {
      await onToggle();
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }

  const sizeClass = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const iconSize = size === "sm" ? 12 : 16;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200",
        sizeClass,
        isAnimating && "scale-90",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:scale-110 active:scale-95"
      )}
      style={
        isCompleted
          ? {
              background: color,
              border: `2px solid ${color}`,
              boxShadow: `0 0 12px ${color}40`,
            }
          : {
              background: isHovered ? `${color}20` : "transparent",
              border: `2px solid ${isHovered ? color : `${color}60`}`,
            }
      }
    >
      {isCompleted && (
        <Check
          size={iconSize}
          strokeWidth={2.5}
          style={{ color: "white" }}
        />
      )}
    </button>
  );
}
