"use client";

import { useState } from "react";
import { Lock, Check, Sprout, Flame, Zap, Medal, Trophy, Star, Gem, Sparkles, type LucideProps } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TIER_COLORS, type MilestoneIconName } from "@/lib/milestone-config";
import { MilestoneUnlockModal } from "./milestone-unlock-modal";
import type { MilestoneProgress } from "@/hooks/use-milestones";

type IconComponent = React.FC<LucideProps>;

const MILESTONE_ICONS: Record<MilestoneIconName, IconComponent> = {
  Sprout, Flame, Zap, Medal, Trophy, Star, Gem,
};

interface MilestoneCardProps {
  milestone: MilestoneProgress;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { border, bg, text } = TIER_COLORS[milestone.tier];
  const MilestoneIcon = MILESTONE_ICONS[milestone.icon as MilestoneIconName] ?? Sprout;
  const pct = Math.round((milestone.progress / milestone.daysRequired) * 100);

  const achievedDate = milestone.achievedAt
    ? new Date(milestone.achievedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const daysLeft = milestone.daysRequired - milestone.progress;

  return (
    <>
      <div
        onClick={() => milestone.isUnlocked && setIsModalOpen(true)}
        className={`group relative rounded-2xl p-5 flex flex-col gap-3.5 transition-all duration-200 ${
          milestone.isUnlocked
            ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]"
            : "opacity-45"
        }`}
        style={{
          background: milestone.isUnlocked
            ? `color-mix(in srgb, ${border} 10%, var(--bg-elevated))`
            : "var(--bg-elevated)",
          border: `1.5px solid ${milestone.isUnlocked ? border : "var(--border-subtle)"}`,
        }}
      >
        {/* Lock overlay for locked milestones */}
        {!milestone.isUnlocked && (
          <div
            className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg-hover)" }}
          >
            <Lock size={12} style={{ color: "var(--text-disabled)" }} />
          </div>
        )}

        {/* Unlocked Holo Card Indicator */}
        {milestone.isUnlocked && (
          <div
            className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/20 shadow-xs"
            style={{
              background: "color-mix(in srgb, var(--accent) 18%, transparent)",
              color: "var(--text-primary)",
            }}
          >
            <Sparkles size={11} className="text-[var(--accent)]" />
            <span>3D Card</span>
          </div>
        )}

        {/* Icon + tier badge */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
            style={{
              background: milestone.isUnlocked ? border : "var(--bg-sunken)",
              color: milestone.isUnlocked ? "#ffffff" : "var(--text-disabled)",
            }}
          >
            <MilestoneIcon size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: text }}>
              {milestone.tier}
            </span>
            <p
              className="text-sm font-bold leading-snug"
              style={{ color: milestone.isUnlocked ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              {milestone.name}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {milestone.description}
        </p>

        {/* Progress */}
        <div className="pt-1 mt-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
              {milestone.progress} / {milestone.daysRequired} days
            </span>
            {milestone.isUnlocked ? (
              <span className="text-xs font-semibold flex items-center gap-1" style={{ color: text }}>
                <Check size={12} className="stroke-[3]" /> Unlocked
              </span>
            ) : (
              <span className="text-xs font-mono" style={{ color: "var(--text-disabled)" }}>
                {daysLeft} to go
              </span>
            )}
          </div>
          <Progress
            value={pct}
            color={milestone.isUnlocked ? border : undefined}
          />
        </div>

        {/* Achievement date / Tap Hint */}
        {milestone.isUnlocked && (
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
            <span style={{ color: text }}>Achieved {achievedDate || "Today"}</span>
            <span className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] font-medium transition-colors">
              Inspect in 3D →
            </span>
          </div>
        )}
      </div>

      {/* Interactive 3D Holographic Card Modal */}
      <MilestoneUnlockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestone={{
          daysRequired: milestone.daysRequired,
          name: milestone.name,
          tier: milestone.tier,
          description: milestone.description,
          iconName: milestone.icon,
          achievedAt: milestone.achievedAt,
        }}
      />
    </>
  );
}
