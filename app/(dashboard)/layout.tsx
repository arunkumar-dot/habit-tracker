import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserSync } from "@/components/layout/user-sync";
import { ToastProvider } from "@/components/ui/toast";
import { NotificationProvider } from "@/components/notifications/notification-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {/* Sync Clerk user → Convex on every dashboard load */}
      <UserSync />
      {/* Schedule habit reminders and expose notification state app-wide */}
      <NotificationProvider>
        <div className="flex h-full">
          {/* Desktop sidebar */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
            <Topbar />

            <main
              className="flex-1 overflow-y-auto pb-20 lg:pb-0"
              style={{ background: "var(--bg-base)" }}
            >
              <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile bottom navigation */}
          <MobileNav />
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
}
