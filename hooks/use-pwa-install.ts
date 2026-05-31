"use client";

import { useEffect, useState } from "react";

type InstallState = "unavailable" | "ready" | "installed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function usePWAInstall(): {
  state: InstallState;
  promptInstall: () => Promise<void>;
} {
  const [state, setState] = useState<InstallState>("unavailable");

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      const timer = setTimeout(() => setState("installed"), 0);
      return () => clearTimeout(timer);
    }

    let readyTimer: ReturnType<typeof setTimeout> | null = null;
    if (deferredPrompt) {
      readyTimer = setTimeout(() => setState("ready"), 0);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setState("ready");
    };

    const handleAppInstalled = () => {
      deferredPrompt = null;
      setState("installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      if (readyTimer) clearTimeout(readyTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setState("installed");
    }
    deferredPrompt = null;
  }

  return { state, promptInstall };
}
