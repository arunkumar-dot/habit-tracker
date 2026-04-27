"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, Clock, CalendarDays, BarChart3, Timer, Trophy, User, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/habits", icon: ListChecks, label: "Habits" },
  { href: "/timeline", icon: Clock, label: "Timeline" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/journal", icon: BookOpen, label: "Journal" },
  { href: "/pomodoro", icon: Timer, label: "Pomodoro" },
  { href: "/milestones", icon: Trophy, label: "Milestones" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
            style={{
              color: isActive ? "var(--accent-primary)" : "var(--text-disabled)",
            }}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
