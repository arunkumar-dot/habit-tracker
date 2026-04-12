"use client";

import { UserButton } from "@clerk/nextjs";
import { PanelLeft } from "lucide-react";
import { NotificationToggle } from "@/components/notifications/notification-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTheme } from "@/components/providers/theme-provider";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { user } = useCurrentUser();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const firstName = user?.name?.split(" ")[0] ?? "";
  const greeting = `${getGreeting()}${firstName ? `, ${firstName}` : ""} 👋`;

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6 flex-shrink-0 h-[72px]"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
    >
      {/* Left: toggle button (desktop) + app name (mobile) */}
      <div className="flex-1 flex items-center gap-3">
        {/* Sidebar toggle — desktop only */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "var(--accent-primary)" }}
          >
            H
          </div>
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            HabitFlow
          </span>
        </div>
      </div>

      {/* Center: greeting */}
      <div className="hidden lg:flex flex-1 justify-center">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {greeting}
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <ThemeToggle />
        <NotificationToggle />

        {/* Clerk user button — appearance adapts to current theme */}
        <UserButton
          appearance={{
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: isLight ? "#ffffff" : "#12121a",
              colorText: isLight ? "#0f172a" : "#f1f5f9",
              colorTextSecondary: isLight ? "#475569" : "#cbd5e1",
              borderRadius: "0.75rem",
            },
            elements: {
              userButtonPopoverCard: {
                background: isLight ? "#f8fafc" : "#1a1a28",
                border: isLight ? "1px solid #e2e8f0" : "1px solid #2a2a3e",
              },
              userButtonPopoverActionButton: {
                color: isLight ? "#0f172a" : "#f1f5f9",
                borderRadius: "0.5rem",
              },
              userButtonPopoverActionButtonText: {
                color: isLight ? "#0f172a" : "#f1f5f9",
              },
              userButtonPopoverActionButtonIcon: {
                color: isLight ? "#4f46e5" : "#a5b4fc",
              },
              userButtonPopoverUserFullName: {
                color: isLight ? "#0f172a" : "#f1f5f9",
              },
              userButtonPopoverUserEmailAddress: {
                color: isLight ? "#475569" : "#cbd5e1",
              },
              userPreviewMainIdentifier: {
                color: isLight ? "#0f172a" : "#f1f5f9",
                fontWeight: "600",
              },
              userPreviewSecondaryIdentifier: {
                color: isLight ? "#475569" : "#cbd5e1",
              },
            },
          }}
        />
      </div>
    </header>
  );
}
