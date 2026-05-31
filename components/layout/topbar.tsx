"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { PanelLeft } from "lucide-react";
import { NotificationToggle } from "@/components/notifications/notification-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useTheme } from "@/components/providers/theme-provider";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    setMounted(true);
    setDateLabel(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  // Use "light" before mount so server HTML and initial client render agree.
  // After mount the real theme kicks in without a hydration mismatch.
  const isLight = mounted ? theme === "light" : true;

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6 flex-shrink-0 h-[72px]"
      style={{ background: "var(--bg-base)" }}
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
          <Image
            src="/logo.svg"
            alt="HabitFlow"
            width={28}
            height={28}
          />
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            HabitFlow
          </span>
        </div>
      </div>

      {/* Center: today's date — empty on SSR, filled after mount to avoid timezone mismatch */}
      <div className="hidden lg:flex flex-1 justify-center">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "16px",
            color: "var(--text-secondary)",
          }}
        >
          {dateLabel}
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex-1 flex items-center justify-end gap-3">
        <ThemeToggle />
        <NotificationToggle />

        {/* UserButton is client-only (ClerkHostRenderer adds DOM nodes not present in SSR HTML).
            Render a placeholder on the server / first pass, swap in the real button after mount. */}
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
                borderRadius: "10px",
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
                  color: isLight ? "#57534E" : "#C8C2B8",
                },
              },
            }}
          />
        )}
      </div>
    </header>
  );
}
