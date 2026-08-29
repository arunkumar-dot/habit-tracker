"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserSync } from "@/components/layout/user-sync";
import { UserGate } from "@/components/layout/user-gate";
import { PageTransition } from "@/components/layout/page-transition";
import { Footer } from "@/components/layout/footer";
import { ToastProvider } from "@/components/ui/toast";
import { ConfettiProvider } from "@/components/ui/confetti";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { InstallPrompt } from "@/components/install-prompt";

import { ThreeAmbientCanvas } from "@/components/3d/three-ambient-canvas";
import { CommandPalette } from "@/components/layout/command-palette";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();

  // Key on userId so all dashboard components remount when the signed-in
  // user changes, clearing stale Convex query state from the previous session.
  return (
    <ToastProvider key={user?.id}>
      <ConfettiProvider>
        {/* Sync Clerk user → Convex on every dashboard load */}
        <UserSync />

        {/* Global Command Palette */}
        <CommandPalette />

        {/* Ambient 3D canvas */}
        <ThreeAmbientCanvas intensity={0.9} />

        <div className="relative z-10 flex h-full">
          {/* Desktop sidebar */}
          <Sidebar collapsed={collapsed} />

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
            <OfflineBanner />
            <Topbar onToggleSidebar={() => setCollapsed((c) => !c)} />
            <InstallPrompt />

            <main
              className="flex-1 overflow-y-auto pb-28 lg:pb-0"
              style={{ background: "transparent" }}
            >
              <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
                {/* NotificationProvider is inside UserGate so it only mounts
                    after the Convex user record exists — prevents "User not found"
                    errors from useHabits() on first sign-up. */}
                <UserGate>
                  <NotificationProvider>
                    <PageTransition>{children}</PageTransition>
                  </NotificationProvider>
                </UserGate>
              </div>
              <div className="max-w-3xl mx-auto px-4 lg:px-6">
                <Footer />
              </div>
            </main>
          </div>

          {/* Mobile bottom navigation */}
          <MobileNav />
        </div>
      </ConfettiProvider>
    </ToastProvider>
  );
}
