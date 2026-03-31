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
      className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
      style={{
        color: enabled ? "var(--accent-primary)" : "var(--text-secondary)",
        background: enabled ? "color-mix(in srgb, var(--accent-primary) 10%, transparent)" : "transparent",
        border: "1px solid",
        borderColor: enabled ? "color-mix(in srgb, var(--accent-primary) 30%, transparent)" : "var(--border)",
        opacity: isBlocked ? 0.5 : 1,
        cursor: isBlocked ? "not-allowed" : "pointer",
      }}
    >
      <span className="relative">
        <Bell size={14} />
        {/* Green dot indicator when enabled */}
        {enabled && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
            style={{ background: "var(--accent-success)", border: "1.5px solid var(--bg-surface)" }}
          />
        )}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
