import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ListChecks,
  BookOpen,
  Compass,
  Settings,
  // Keep old imports available for sidebar (desktop still shows them)
  Clock,
  CalendarDays,
  BarChart3,
  Timer,
  Trophy,
  Sparkles,
} from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  /** Shorter label shown on narrow mobile tabs (falls back to label). */
  mobileLabel?: string;
}

/** All routes — used by the desktop sidebar. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Today",    mobileLabel: "Today" },
  { href: "/habits",     icon: ListChecks,      label: "Habits" },
  { href: "/journal",    icon: BookOpen,        label: "Journal" },
  { href: "/journey",    icon: Compass,         label: "Journey" },
  { href: "/settings",   icon: Settings,        label: "Settings" },
  // Legacy pages — accessible via direct URL but hidden from mobile nav
  { href: "/analytics",  icon: BarChart3,       label: "Analytics" },
  { href: "/insights",   icon: Sparkles,        label: "Insights" },
  { href: "/timeline",   icon: Clock,           label: "Timeline" },
  { href: "/milestones", icon: Trophy,          label: "Milestones" },
  { href: "/calendar",   icon: CalendarDays,    label: "Calendar" },
  { href: "/pomodoro",   icon: Timer,           label: "Pomodoro" },
];

/** The 5 routes that appear as direct tabs in the mobile bottom bar. */
export const PRIMARY_NAV: NavItem[] = NAV_ITEMS.filter((item) =>
  ["/dashboard", "/habits", "/journal", "/journey", "/settings"].includes(item.href)
);

/** Routes accessible via the "More" drawer on mobile. Empty — legacy pages hidden per V2. */
export const MORE_NAV: NavItem[] = [];
