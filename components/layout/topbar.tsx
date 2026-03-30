"use client";

import { UserButton } from "@clerk/nextjs";
import { today, formatDateLabel } from "@/lib/date-utils";

export function Topbar() {
  const todayLabel = formatDateLabel(today());
  const fullDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="flex items-center justify-between px-4 lg:px-6 py-3 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}
    >
      {/* App name on mobile */}
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

      {/* Date display */}
      <div className="hidden lg:block">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {fullDate}
        </p>
      </div>

      <div className="flex-1 lg:flex-none" />

      {/* Clerk user button */}
      <UserButton
        appearance={{
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: "#12121a",
            colorText: "#f1f5f9",
            colorTextSecondary: "#cbd5e1",
            borderRadius: "0.75rem",
          },
          elements: {
            userButtonPopoverCard: {
              background: "#1a1a28",
              border: "1px solid #2a2a3e",
            },
            userButtonPopoverActionButton: {
              color: "#f1f5f9",
              borderRadius: "0.5rem",
            },
            "userButtonPopoverActionButton:hover": {
              background: "#2a2a4a",
              color: "#a5b4fc",
            },
            userButtonPopoverActionButtonText: {
              color: "#f1f5f9",
            },
            userButtonPopoverActionButtonIcon: {
              color: "#a5b4fc",
            },
            userButtonPopoverUserFullName: {
              color: "#f1f5f9",
            },
            userButtonPopoverUserEmailAddress: {
              color: "#cbd5e1",
            },
            userPreviewMainIdentifier: {
              color: "#f1f5f9",
              fontWeight: "600",
            },
            userPreviewSecondaryIdentifier: {
              color: "#cbd5e1",
            },
          },
        }}
      />
    </header>
  );
}
