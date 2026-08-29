"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Check, Flame, Zap, Sprout, Star, Gem, Medal, Share2, X } from "lucide-react";
import { useConfetti } from "@/components/ui/confetti";
import { useTheme } from "@/components/providers/theme-provider";

export interface HolographicMilestoneData {
  daysRequired: number;
  name: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  description: string;
  iconName?: string;
  habitTitle?: string;
  achievedAt?: number;
}

interface HolographicMilestoneCardProps {
  milestone: HolographicMilestoneData;
  onClose?: () => void;
}

const TIER_GRADIENTS = {
  bronze: {
    badgeBg: "linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)",
    accent: "#F59E0B",
    glow: "rgba(245, 158, 11, 0.45)",
    foilGlow: "linear-gradient(115deg, transparent 20%, rgba(251, 191, 36, 0.3) 40%, rgba(245, 158, 11, 0.5) 50%, transparent 70%)",
  },
  silver: {
    badgeBg: "linear-gradient(135deg, #374151 0%, #6B7280 50%, #9CA3AF 100%)",
    accent: "#E5E7EB",
    glow: "rgba(229, 231, 235, 0.45)",
    foilGlow: "linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.4) 40%, rgba(209, 213, 219, 0.5) 50%, transparent 70%)",
  },
  gold: {
    badgeBg: "linear-gradient(135deg, #854D0E 0%, #CA8A04 50%, #FACC15 100%)",
    accent: "#FDE047",
    glow: "rgba(250, 204, 21, 0.55)",
    foilGlow: "linear-gradient(115deg, transparent 20%, rgba(254, 240, 138, 0.5) 40%, rgba(234, 179, 8, 0.6) 50%, transparent 70%)",
  },
  platinum: {
    badgeBg: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #818CF8 100%)",
    accent: "#A5B4FC",
    glow: "rgba(129, 140, 248, 0.55)",
    foilGlow: "linear-gradient(115deg, transparent 20%, rgba(199, 210, 254, 0.5) 40%, rgba(99, 102, 241, 0.6) 50%, transparent 70%)",
  },
  diamond: {
    badgeBg: "linear-gradient(135deg, #064E3B 0%, #0D9488 40%, #06B6D4 80%, #38BDF8 100%)",
    accent: "#67E8F9",
    glow: "rgba(6, 182, 212, 0.6)",
    foilGlow: "linear-gradient(115deg, transparent 20%, rgba(165, 243, 252, 0.6) 40%, rgba(56, 189, 248, 0.7) 50%, transparent 70%)",
  },
};

const ICONS = {
  Sprout,
  Flame,
  Zap,
  Medal,
  Trophy,
  Star,
  Gem,
};

export function HolographicMilestoneCard({ milestone, onClose }: HolographicMilestoneCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const { triggerConfetti } = useConfetti();

  const themeConfig = TIER_GRADIENTS[milestone.tier] ?? TIER_GRADIENTS.gold;
  const IconComponent = (milestone.iconName && ICONS[milestone.iconName as keyof typeof ICONS]) || Trophy;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotation calculation: max 18 degrees
    const rX = ((y - centerY) / centerY) * -18;
    const rY = ((x - centerX) / centerX) * 18;

    setRotX(rX);
    setRotY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.85,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotX(0);
    setRotY(0);
    setGlarePos((p) => ({ ...p, opacity: 0 }));
  }, []);

  const handleShare = async () => {
    triggerConfetti();
    const text = `🏆 I unlocked the ${milestone.name} badge (${milestone.daysRequired} days) on RoutineIQ! #Habits #Discipline`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 3D Tilt Card Container */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-sm flex justify-center items-center py-4 select-none"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ scale: 0.85, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{
            transform: `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.08s ease-out",
            boxShadow: `0 24px 60px -12px ${themeConfig.glow}, 0 0 35px 2px ${themeConfig.glow}`,
          }}
          className="relative w-80 sm:w-88 h-[450px] rounded-[32px] overflow-hidden border border-white/20 p-7 flex flex-col justify-between cursor-pointer"
        >
          {/* Card Base Background Gradient */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `linear-gradient(165deg, rgba(20, 20, 25, 0.94) 0%, rgba(10, 10, 14, 0.98) 100%)`,
            }}
          />

          {/* Holographic Multi-Color Chromatic Foil Sheen */}
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `
                radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, transparent 60%),
                conic-gradient(from ${rotY * 8}deg at ${glarePos.x}% ${glarePos.y}%, 
                  rgba(255, 0, 128, 0.3) 0deg, 
                  rgba(0, 255, 255, 0.35) 90deg, 
                  rgba(255, 215, 0, 0.3) 180deg, 
                  rgba(147, 51, 234, 0.35) 270deg, 
                  rgba(255, 0, 128, 0.3) 360deg
                )
              `,
              mixBlendMode: "color-dodge",
            }}
          />

          {/* Radial Ambient Backlight */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ background: themeConfig.accent }}
          />

          {/* ── Card Header (Layered 3D) ──────────────────────────────────── */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="relative z-20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/20"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  color: themeConfig.accent,
                }}
              >
                {milestone.tier} Edition
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-white/50">
              ROUTINE<span style={{ color: themeConfig.accent }}>IQ</span>
            </span>
          </div>

          {/* ── Center 3D Holographic Emblem (Layered 3D) ─────────────────── */}
          <div
            style={{ transform: "translateZ(50px)" }}
            className="relative z-20 flex flex-col items-center justify-center my-auto py-2"
          >
            {/* Glowing Aura Ring */}
            <div
              className="relative w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl p-1"
              style={{
                background: themeConfig.badgeBg,
                boxShadow: `0 0 40px 8px ${themeConfig.glow}`,
                border: "2px solid rgba(255, 255, 255, 0.35)",
              }}
            >
              <IconComponent size={54} className="text-white drop-shadow-lg" />

              {/* Sparkle Badges */}
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>

            {/* Streak Number */}
            <div className="mt-4 text-center">
              <div
                className="text-4xl font-black tracking-tight"
                style={{
                  color: "#FFFFFF",
                  textShadow: `0 2px 20px ${themeConfig.glow}`,
                  fontFamily: "var(--font-display)",
                }}
              >
                {milestone.daysRequired} DAYS
              </div>
              <p className="text-sm font-semibold tracking-wide mt-1 text-white/90">
                {milestone.name}
              </p>
            </div>
          </div>

          {/* ── Card Footer: Description & Habit Name ──────────────────────── */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="relative z-20 pt-3 border-t border-white/10 flex flex-col gap-1 text-center"
          >
            <p className="text-xs text-white/70 leading-relaxed">
              &ldquo;{milestone.description}&rdquo;
            </p>
            {milestone.habitTitle && (
              <p className="text-[11px] font-mono text-white/40 truncate">
                Habit: {milestone.habitTitle}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-sm">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95"
          style={{
            background: "var(--accent)",
            color: "#ffffff",
          }}
        >
          {isCopied ? <Check size={14} /> : <Share2 size={14} />}
          <span>{isCopied ? "Badge Copied to Clipboard!" : "Share Milestone Badge"}</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl font-semibold text-xs border border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
