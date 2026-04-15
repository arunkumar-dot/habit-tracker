"use client";

import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useNotifications } from "./notification-provider";

export function NotificationToggle() {
  const { enabled, toggleEnabled, permission } = useNotifications();
  const { showToast } = useToast();

  const handleToggle = async () => {
    const result = await toggleEnabled();
    if (result === "denied") {
      showToast(
        "Notifications blocked — enable them in your browser settings.",
        "error"
      );
    }
  };

  const isBlocked = permission === "denied";
  const label = enabled ? "Reminders On" : "Enable Reminders";
  const title = isBlocked
    ? "Notifications are blocked in your browser"
    : label;

  return (
    <button
      onClick={handleToggle}
      title={title}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
      style={{
        color: enabled ? "var(--text-primary)" : "var(--text-secondary)",
        opacity: isBlocked ? 0.5 : 1,
        cursor: isBlocked ? "not-allowed" : "pointer",
      }}
      aria-label={label}
    >
      <Bell size={18} />
      {/* 6px --accent dot when reminders are on */}
      {enabled && (
        <span
          className="absolute top-1 right-1 rounded-full"
          style={{
            width: "6px",
            height: "6px",
            background: "var(--accent)",
          }}
        />
      )}
    </button>
  );
}
