"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/nav-config";

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  const mainNavItems = NAV_ITEMS.filter((item) => item.href !== "/settings");
  const isSettingsActive = pathname === "/settings" || pathname.startsWith("/settings/");
  const settingsItem = NAV_ITEMS.find((item) => item.href === "/settings");

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 z-20",
        collapsed ? "w-18" : "w-60"
      )}
      style={{
        background: "color-mix(in srgb, var(--bg-base) 70%, transparent)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-[68px] px-5 gap-3 flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.06, rotate: 4 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer flex-shrink-0"
        >
          <Image
            src="/logo.svg"
            alt="HabitFlow"
            width={30}
            height={30}
            className="flex-shrink-0"
          />
        </motion.div>
        {!collapsed && (
          <span
            className="truncate select-none font-bold tracking-tight text-lg"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "var(--text-primary)",
            }}
          >
            HabitFlow
          </span>
        )}
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-xl group",
                collapsed && "justify-center px-2"
              )}
              style={{
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <item.icon
                size={18}
                className={cn(
                  "relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                  isActive ? "stroke-[2.25]" : "stroke-[1.75]"
                )}
              />
              {!collapsed && (
                <span className="relative z-10 font-medium">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings at the bottom (clean, seamless without hard dividing line) */}
      {settingsItem && (
        <div className="p-3 flex-shrink-0">
          <Link
            href={settingsItem.href}
            title={collapsed ? settingsItem.label : undefined}
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-xl group",
              collapsed && "justify-center px-2"
            )}
            style={{
              color: isSettingsActive ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {isSettingsActive && (
              <motion.div
                layoutId="sidebarActivePill"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                }}
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <settingsItem.icon
              size={18}
              className={cn(
                "relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                isSettingsActive ? "stroke-[2.25]" : "stroke-[1.75]"
              )}
            />
            {!collapsed && (
              <span className="relative z-10 font-medium">
                {settingsItem.label}
              </span>
            )}
          </Link>
        </div>
      )}
    </aside>
  );
}
