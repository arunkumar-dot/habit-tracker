"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MoreHorizontal, X } from "lucide-react";
import { Drawer } from "vaul";
import { PRIMARY_NAV, MORE_NAV } from "@/lib/nav-config";

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* ── Floating pill nav ────────────────────────────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-2"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
      >
        <div
          className="flex items-center"
          style={{
            background: "color-mix(in srgb, var(--bg-elevated) 88%, transparent)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "100px",
            padding: "5px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {PRIMARY_NAV.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="relative flex items-center justify-center transition-all duration-200"
                style={{
                  gap: "6px",
                  flex: isActive ? "0 0 auto" : "1",
                  minWidth: 0,
                  padding: isActive ? "10px 16px" : "10px 0",
                  borderRadius: "100px",
                  color: isActive ? "#ffffff" : "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                  minHeight: 44,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTabPill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 4px 16px -2px color-mix(in srgb, var(--accent) 50%, transparent)",
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="relative z-10 flex items-center gap-1.5"
                >
                  <item.icon
                    size={19}
                    aria-hidden="true"
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm font-semibold leading-none"
                    >
                      {item.mobileLabel ?? item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}

          {/* More tab — only shown when MORE_NAV has items */}
          {MORE_NAV.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              className="flex items-center justify-center transition-all duration-200"
              style={{
                flex: "1",
                minWidth: 0,
                padding: "9px 0",
                borderRadius: "100px",
                background: isMoreActive
                  ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                  : "transparent",
                color: isMoreActive ? "var(--accent)" : "var(--text-tertiary)",
                minHeight: 44,
              }}
              aria-label="More navigation options"
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
            >
              <MoreHorizontal size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </nav>

      {/* ── More drawer ──────────────────────────────────────────────────────── */}
      <Drawer.Root open={moreOpen} onOpenChange={setMoreOpen}>
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.4)" }}
          />
          <Drawer.Content
            aria-label="More navigation"
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl"
            style={{
              background: "var(--bg-surface)",
              borderTop: "1px solid var(--border)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <Drawer.Handle
              className="mx-auto mt-3 mb-2 rounded-full"
              style={{ width: 48, height: 6, background: "var(--text-disabled)", opacity: 0.4 }}
            />

            {/* Sheet header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <Drawer.Title
                className="text-base font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                More
              </Drawer.Title>
              <Drawer.Close
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Close"
              >
                <X size={18} aria-hidden="true" />
              </Drawer.Close>
            </div>

            {/* Grid of secondary destinations */}
            <div className="grid grid-cols-3 gap-2 p-4">
              {MORE_NAV.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl transition-colors"
                    style={{
                      minHeight: 80,
                      padding: "12px 8px",
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                      background: isActive
                        ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                        : "var(--bg-hover)",
                    }}
                  >
                    <item.icon size={22} aria-hidden="true" />
                    <span
                      className="text-xs font-medium text-center leading-tight"
                      style={{ color: "inherit" }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
