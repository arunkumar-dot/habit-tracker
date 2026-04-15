"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, CalendarDays, BarChart3, Zap, Timer, Trophy, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/timeline", icon: Clock, label: "Timeline" },
  { href: "/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/insights", icon: Sparkles, label: "Insights" },
  { href: "/pomodoro", icon: Timer, label: "Pomodoro" },
  { href: "/milestones", icon: Trophy, label: "Milestones" },
  { href: "/profile", icon: User, label: "Profile" },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
      style={{
        background: "var(--bg-elevated)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-[72px] px-4 gap-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div
          className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center"
          style={{ background: "var(--accent)" }}
        >
          <Zap size={16} fill="white" style={{ color: "white" }} />
        </div>
        {!collapsed && (
          <span
            className="truncate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 400,
              color: "var(--text-primary)",
            }}
          >
            HabitFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-md",
                collapsed && "justify-center px-2"
              )}
              style={
                isActive
                  ? {
                      color: "var(--accent)",
                      borderLeft: "2px solid var(--accent)",
                      paddingLeft: collapsed ? undefined : "10px",
                    }
                  : {
                      color: "var(--text-secondary)",
                      borderLeft: "2px solid transparent",
                      paddingLeft: collapsed ? undefined : "10px",
                    }
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer removed — version moved to Profile page */}
    </aside>
  );
}
