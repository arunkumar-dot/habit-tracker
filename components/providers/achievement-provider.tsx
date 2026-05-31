"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  AchievementUnlockOverlay,
  type AchievementOverlayData,
} from "@/components/rpg/achievement-unlock-overlay";

interface AchievementContextValue {
  showAchievement: (data: AchievementOverlayData) => void;
}

const AchievementContext = createContext<AchievementContextValue>({
  showAchievement: () => {},
});

export function AchievementProvider({ children }: { children: ReactNode }) {
  // Queue of achievements to display; first item is what's currently shown.
  // No useEffect needed — queue drains via the onDismiss event handler.
  const [queue, setQueue] = useState<AchievementOverlayData[]>([]);

  const showAchievement = useCallback((data: AchievementOverlayData) => {
    setQueue((prev) => [...prev, data]);
  }, []);

  function dismiss() {
    setQueue((prev) => prev.slice(1));
  }

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      <AchievementUnlockOverlay achievement={queue[0] ?? null} onDismiss={dismiss} />
    </AchievementContext.Provider>
  );
}

export function useAchievementUnlock() {
  return useContext(AchievementContext);
}
