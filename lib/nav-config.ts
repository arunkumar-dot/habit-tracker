import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ListChecks,
  Timer,
  Compass,
  Trophy,
  BookOpen,
  CalendarDays,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  mobileLabel?: string;
}

/** The core pillars — used by the desktop sidebar */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Today", mobileLabel: "Today" },
  { href: "/habits", icon: ListChecks, label: "Habits", mobileLabel: "Habits" },
  { href: "/pomodoro", icon: Timer, label: "Pomodoro", mobileLabel: "Focus" },
  { href: "/journey", icon: Compass, label: "Journey", mobileLabel: "Journey" },
  { href: "/milestones", icon: Trophy, label: "Milestones", mobileLabel: "Badges" },
  { href: "/journal", icon: BookOpen, label: "Journal", mobileLabel: "Journal" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar", mobileLabel: "Calendar" },
  { href: "/settings", icon: Settings, label: "Settings", mobileLabel: "Settings" },
];

/** The 5 primary tabs for the floating mobile nav */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Today", mobileLabel: "Today" },
  { href: "/habits", icon: ListChecks, label: "Habits", mobileLabel: "Habits" },
  { href: "/pomodoro", icon: Timer, label: "Pomodoro", mobileLabel: "Focus" },
  { href: "/journey", icon: Compass, label: "Journey", mobileLabel: "Journey" },
  { href: "/milestones", icon: Trophy, label: "Milestones", mobileLabel: "Badges" },
];

export const MORE_NAV: NavItem[] = [
  { href: "/journal", icon: BookOpen, label: "Journal" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/settings", icon: Settings, label: "Settings" },
];
