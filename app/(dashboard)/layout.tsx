"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserSync } from "@/components/layout/user-sync";
import { PageTransition } from "@/components/layout/page-transition";
import { ToastProvider } from "@/components/ui/toast";
import { ConfettiProvider } from "@/components/ui/confetti";
import { NotificationProvider } from "@/components/notifications/notification-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <ConfettiProvider>
        {/* Sync Clerk user → Convex on every dashboard load */}
        <UserSync />
        {/* Schedule habit reminders and expose notification state app-wide */}
        <NotificationProvider>
          <div className="flex h-full">
            {/* Desktop sidebar */}
            <Sidebar collapsed={collapsed} />

            {/* Main content area */}
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
              <Topbar onToggleSidebar={() => setCollapsed((c) => !c)} />

              <main
                className="flex-1 overflow-y-auto pb-20 lg:pb-0"
                style={{ background: "var(--bg-base)" }}
              >
                <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
                  <PageTransition>{children}</PageTransition>
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
