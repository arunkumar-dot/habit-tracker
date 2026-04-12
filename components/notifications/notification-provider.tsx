"use client";

import { createContext, useContext, useEffect } from "react";
import { useHabits } from "@/hooks/use-habits";
import { useHabitNotifications } from "@/hooks/use-habit-notifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/components/ui/toast";

interface NotificationContextValue {
  permission: NotificationPermission;
  enabled: boolean;
  fcmReady: boolean;
  fcmSupported: boolean;
  toggleEnabled: () => Promise<"enabled" | "toggled-off" | "denied">;
}

const NotificationContext = createContext<NotificationContextValue>({
  permission: "default",
  enabled: false,
  fcmReady: false,
  fcmSupported: false,
  toggleEnabled: async () => "denied",
});

export function useNotifications() {
  return useContext(NotificationContext);
}

/**
 * Combines two notification strategies:
 *
 *  1. In-app (setTimeout) — `useHabitNotifications`
 *     Works while the tab is open. Shows native browser notifications.
 *
 *  2. FCM push — `usePushNotifications`
 *     Works even when the app is closed / browser is minimised.
 *     Requires Firebase to be configured (NEXT_PUBLIC_FIREBASE_* env vars).
 *
 * The two strategies share the same "enabled" toggle so the user only sees
 * one control. Enabling registers an FCM token; disabling removes it.
 *
 * Foreground FCM messages (received while the app is open) are shown as
 * in-app toasts via the `fcm-foreground-message` custom DOM event dispatched
 * by `usePushNotifications`.
 */
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { habits } = useHabits();
  const { showToast } = useToast();

  // Strategy 1 — in-app setTimeout scheduling
  const { permission, enabled, toggleEnabled: toggleLocalEnabled } =
    useHabitNotifications(habits ?? []);

  // Strategy 2 — FCM push notifications
  const {
    fcmReady,
    fcmSupported,
    registerFCMToken,
    unregisterFCMToken,
  } = usePushNotifications();

  // Listen for FCM foreground messages and show them as toasts
  useEffect(() => {
    const handleForeground = (e: Event) => {
      const { title, body } = (e as CustomEvent<{ title: string; body: string }>).detail;
      showToast(`${title}: ${body}`, "info");
    };
    window.addEventListener("fcm-foreground-message", handleForeground);
    return () =>
      window.removeEventListener("fcm-foreground-message", handleForeground);
  }, [showToast]);

  /**
   * Unified toggle:
   *  - Enabling: request permission (via existing hook) → if granted, also
   *    register FCM token for background delivery.
   *  - Disabling: clear local timers (via existing hook) + remove FCM token.
   */
  const toggleEnabled = async (): Promise<"enabled" | "toggled-off" | "denied"> => {
    if (enabled) {
      // Turn off: cancel local timers and remove FCM token
      await toggleLocalEnabled(); // → "toggled-off"
      await unregisterFCMToken();
      return "toggled-off";
    }

    // Turn on: request permission first (handled by the local hook)
    const result = await toggleLocalEnabled();

    if (result === "enabled") {
      // Also register the FCM token for background delivery
      if (fcmSupported) {
        const fcmResult = await registerFCMToken();
        if (fcmResult === "error") {
          // FCM failed but local notifications are still on — non-fatal
          console.warn("[FCM] Token registration failed; falling back to in-app only.");
        }
      }
    }

    return result;
  };

  const value: NotificationContextValue = {
    permission,
    enabled,
    fcmReady,
    fcmSupported,
    toggleEnabled,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
