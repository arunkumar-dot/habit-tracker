"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useTheme } from "@/components/providers/theme-provider";
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

type DashboardThemeStyle = CSSProperties & Record<`--${string}`, string>;

const dashboardThemeStyles: Record<string, DashboardThemeStyle> = {
  light: {
    "--bg-base": "#FAF8F4",
    "--bg-elevated": "#FFFFFF",
    "--bg-sunken": "#F3EFE8",
    "--bg-hover": "#EFEAE1",
    "--text-primary": "#1C1B18",
    "--text-secondary": "#57534E",
    "--border-subtle": "#E8E3DA",
    "--border-default": "#D9D3C7",
    "--accent": "#C2410C",
    background: "#FAF8F4",
    color: "#1C1B18",
  },
  dark: {
    "--bg-base": "#1A1614",
    "--bg-elevated": "#231E1B",
    "--bg-sunken": "#14100E",
    "--bg-hover": "#2A2522",
    "--text-primary": "#F5F1EA",
    "--text-secondary": "#C8C2B8",
    "--border-subtle": "#2E2825",
    "--border-default": "#3D3631",
    "--accent": "#E86F3C",
    background: "#1A1614",
    color: "#F5F1EA",
  },
  space: {
    "--bg-base": "#050816",
    "--bg-elevated": "#0F172A",
    "--bg-sunken": "#020617",
    "--bg-hover": "#1E1B4B",
    "--text-primary": "#EDE9FE",
    "--text-secondary": "#A5B4FC",
    "--border-subtle": "rgba(167, 139, 250, 0.18)",
    "--border-default": "rgba(167, 139, 250, 0.32)",
    "--accent": "#8B5CF6",
    background:
      "radial-gradient(ellipse at 28% 8%, rgba(139, 92, 246, 0.22), transparent 42%), radial-gradient(ellipse at 82% 2%, rgba(6, 182, 212, 0.14), transparent 36%), #050816",
    color: "#EDE9FE",
  },
  "space-light": {
    "--bg-base": "#EEF2FF",
    "--bg-elevated": "#FFFFFF",
    "--bg-sunken": "#E0E7FF",
    "--bg-hover": "#DDD6FE",
    "--text-primary": "#1E1B4B",
    "--text-secondary": "#4338CA",
    "--border-subtle": "rgba(124, 58, 237, 0.14)",
    "--border-default": "rgba(124, 58, 237, 0.24)",
    "--accent": "#7C3AED",
    background:
      "radial-gradient(ellipse at 28% 8%, rgba(124, 58, 237, 0.16), transparent 42%), radial-gradient(ellipse at 82% 2%, rgba(8, 145, 178, 0.10), transparent 36%), #EEF2FF",
    color: "#1E1B4B",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const { theme } = useTheme();
  const themeStyle = dashboardThemeStyles[theme] ?? dashboardThemeStyles.light;

  // Key on userId so all dashboard components remount when the signed-in
  // user changes, clearing stale Convex query state from the previous session.
  return (
    <ToastProvider key={user?.id}>
      <ConfettiProvider>
        {/* Sync Clerk user → Convex on every dashboard load */}
        <UserSync />
        {/* Schedule habit reminders and expose notification state app-wide */}
        <NotificationProvider>
          <div className="flex h-full" data-active-theme={theme} style={themeStyle}>
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
                  <UserGate>
                    <PageTransition>{children}</PageTransition>
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
        </NotificationProvider>
      </ConfettiProvider>
    </ToastProvider>
  );
}
