"use client";

import { createContext, useContext } from "react";
import { useHabits } from "@/hooks/use-habits";
import { useHabitNotifications } from "@/hooks/use-habit-notifications";

interface NotificationContextValue {
  permission: NotificationPermission;
  enabled: boolean;
  toggleEnabled: () => Promise<"enabled" | "toggled-off" | "denied">;
}

const NotificationContext = createContext<NotificationContextValue>({
  permission: "default",
  enabled: false,
  toggleEnabled: async () => "denied",
});

export function useNotifications() {
  return useContext(NotificationContext);
}

/**
 * Provides notification state to all children.
 * Place in the dashboard layout so the toggle and scheduler share one instance.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { habits } = useHabits();
  const value = useHabitNotifications(habits ?? []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
