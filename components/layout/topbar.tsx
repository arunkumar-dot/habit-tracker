"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { PanelLeft, Search } from "lucide-react";
import { NotificationToggle } from "@/components/notifications/notification-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BackgroundSwitcher } from "@/components/layout/background-switcher";
import { useTheme } from "@/components/providers/theme-provider";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = theme === "light";

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between h-[68px] px-4 lg:px-6 flex-shrink-0 transition-all"
      style={{
        background: "color-mix(in srgb, var(--bg-base) 70%, transparent)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Left: toggle button (desktop) + search pill + app name (mobile) */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle — desktop only */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl transition-all hover:bg-[var(--bg-hover)]"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="HabitFlow"
            width={28}
            height={28}
          />
          <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
            HabitFlow
          </span>
        </div>

        {/* Desktop Quick Command Palette Search Bar */}
        <button
          type="button"
          onClick={triggerCommandPalette}
          className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-panel text-xs transition-all duration-200 hover:bg-[var(--bg-hover)] cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
          title="Search habits and actions (Cmd+K)"
        >
          <Search size={13} className="text-[var(--accent)]" />
          <span className="text-xs font-normal">Search or jump to...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <BackgroundSwitcher />
        <ThemeToggle />
        <NotificationToggle />

        {/* UserButton */}
        {!mounted && (
          <div
            className="w-8 h-8 rounded-full animate-pulse"
            style={{ background: "var(--bg-sunken)" }}
            aria-hidden="true"
          />
        )}
        {mounted && (
          <UserButton
            userProfileUrl="/settings"
            userProfileProps={{
              appearance: {
                elements: {
                  formField__firstName: { display: "none" },
                  formField__lastName: { display: "none" },
                },
              },
            }}
            appearance={{
              variables: {
                colorPrimary: isLight ? "#C2410C" : "#E86F3C",
                colorBackground: isLight ? "#FFFFFF" : "#231E1B",
                colorText: isLight ? "#1C1B18" : "#F5F1EA",
                colorTextSecondary: isLight ? "#57534E" : "#C8C2B8",
                borderRadius: "12px",
              },
              elements: {
                userButtonPopoverCard: {
                  background: isLight ? "#FFFFFF" : "#231E1B",
                  border: isLight ? "1px solid #E8E3DA" : "1px solid #2E2825",
                },
                userButtonPopoverActionButton: {
                  color: isLight ? "#1C1B18" : "#F5F1EA",
                  borderRadius: "8px",
                },
                userButtonPopoverActionButtonText: {
                  color: isLight ? "#1C1B18" : "#F5F1EA",
                },
                userButtonPopoverActionButtonIcon: {
                  color: isLight ? "#C2410C" : "#E86F3C",
                },
                userButtonPopoverUserFullName: {
                  color: isLight ? "#1C1B18" : "#F5F1EA",
                },
                userButtonPopoverUserEmailAddress: {
                  color: isLight ? "#57534E" : "#C8C2B8",
                },
                userPreviewMainIdentifier: {
                  color: isLight ? "#1C1B18" : "#F5F1EA",
                  fontWeight: "600",
                },
                userPreviewSecondaryIdentifier: {
                  color: isLight ? "#8A8680" : "#8A8680",
                },
                userButtonAvatarBox: {
                  width: "32px",
                  height: "32px",
                },
              },
            }}
          />
        )}
      </div>
    </header>
  );
}
