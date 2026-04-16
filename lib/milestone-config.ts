export type MilestoneTier = "bronze" | "silver" | "gold" | "platinum";

export type MilestoneIconName = "Sprout" | "Flame" | "Zap" | "Medal" | "Trophy" | "Star" | "Gem";

export interface MilestoneConfig {
  daysRequired: number;
  name: string;
  description: string;
  icon: MilestoneIconName;
  tier: MilestoneTier;
}

export const MILESTONES: MilestoneConfig[] = [
  {
    daysRequired: 3,
    name: "Getting Started",
    description: "3 days in a row!",
    icon: "Sprout",
    tier: "bronze",
  },
  {
    daysRequired: 7,
    name: "First Week",
    description: "A full week streak!",
    icon: "Flame",
    tier: "bronze",
  },
  {
    daysRequired: 14,
    name: "Building Momentum",
    description: "Two weeks of consistency!",
    icon: "Zap",
    tier: "silver",
  },
  {
    daysRequired: 21,
    name: "Habit Forming",
    description: "21 days — science says it sticks!",
    icon: "Medal",
    tier: "silver",
  },
  {
    daysRequired: 30,
    name: "Strong Habit",
    description: "One full month streak!",
    icon: "Trophy",
    tier: "gold",
  },
  {
    daysRequired: 45,
    name: "Lifestyle Change",
    description: "45 days of daily dedication!",
    icon: "Star",
    tier: "gold",
  },
  {
    daysRequired: 66,
    name: "Habit Mastery",
    description: "66 days — research-backed mastery!",
    icon: "Gem",
    tier: "platinum",
  },
];

export const TIER_COLORS: Record<MilestoneTier, { border: string; bg: string; text: string }> = {
  bronze:   { border: "#cd7f32", bg: "#cd7f3215", text: "#cd7f32" },
  silver:   { border: "#a0a0a0", bg: "#a0a0a015", text: "#a0a0a0" },
  gold:     { border: "#ffd700", bg: "#ffd70015", text: "#b8860b" },
  platinum: { border: "#9b59b6", bg: "#9b59b615", text: "#9b59b6" },
};
