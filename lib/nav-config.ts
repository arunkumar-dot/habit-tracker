import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ListChecks,
  Clock,
  CalendarDays,
  BarChart3,
  Timer,
  Trophy,
  Sparkles,
  BookOpen,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  /** Shorter label shown on narrow mobile tabs (falls back to label). */
  mobileLabel?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard", mobileLabel: "Home" },
  { href: "/habits",     icon: ListChecks,      label: "Habits" },
  { href: "/timeline",   icon: Clock,           label: "Timeline" },
  { href: "/calendar",   icon: CalendarDays,    label: "Calendar" },
  { href: "/analytics",  icon: BarChart3,       label: "Analytics" },
  { href: "/insights",   icon: Sparkles,        label: "Insights" },
  { href: "/journal",    icon: BookOpen,        label: "Journal" },
  { href: "/pomodoro",   icon: Timer,           label: "Pomodoro", mobileLabel: "Focus" },
  { href: "/milestones", icon: Trophy,          label: "Milestones" },
  { href: "/settings",   icon: Settings,        label: "Settings" },
];

/** The 5 routes that appear as direct tabs in the mobile bottom bar. */
export const PRIMARY_NAV: NavItem[] = NAV_ITEMS.filter((item) =>
  ["/dashboard", "/habits", "/timeline", "/pomodoro", "/journal"].includes(item.href)
);

/** Routes accessible via the "More" drawer on mobile. */
export const MORE_NAV: NavItem[] = NAV_ITEMS.filter(
  (item) => !PRIMARY_NAV.includes(item)
);
