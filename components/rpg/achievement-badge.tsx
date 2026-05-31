import { cn } from "@/lib/utils";
import type { MilestoneTier } from "@/lib/milestone-config";

const TIER_STYLES: Record<MilestoneTier, { color: string; label: string }> = {
  bronze:   { color: "var(--ember-orange)",   label: "BRONZE" },
  silver:   { color: "var(--stardust)",        label: "SILVER" },
  gold:     { color: "var(--stellar-gold)",    label: "GOLD" },
  platinum: { color: "var(--nebula-purple)",   label: "PLATINUM" },
};

interface AchievementBadgeProps {
  tier: MilestoneTier;
  className?: string;
}

export function AchievementBadge({ tier, className }: AchievementBadgeProps) {
  const { color, label } = TIER_STYLES[tier];
  return (
    <span
      className={cn("type-stat-label inline-block rounded px-2 py-0.5", className)}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      {label}
    </span>
  );
}
