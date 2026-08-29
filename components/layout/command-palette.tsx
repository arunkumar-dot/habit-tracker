"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Compass,
  Timer,
  Calendar,
  BarChart2,
  Sparkles,
  Trophy,
  Settings,
  Palette,
  Sun,
  Moon,
  Check,
  CheckCircle2,
  X,
} from "lucide-react";
import { useTheme, THEME_PALETTES, type ThemePalette } from "@/components/providers/theme-provider";
import { useHabits } from "@/hooks/use-habits";
import { useCompletionsForDate } from "@/hooks/use-completions";
import { useOptimisticCompletion } from "@/hooks/use-optimistic-completion";
import { today } from "@/lib/date-utils";
import { playCompletionChime } from "@/lib/sound-effects";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Habits" | "Themes" | "Actions";
  icon: typeof Search;
  action: () => void;
  subtitle?: string;
  shortcut?: string;
  completed?: boolean;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { palette, setPalette, theme, toggleTheme } = useTheme();
  const { habits } = useHabits();
  const dateStr = today();
  const { completedHabitIds } = useCompletionsForDate(dateStr);

  // Global shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build command items
  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [];

    // 1. Navigation Pages
    const pages = [
      { title: "Today Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Habits Hub", href: "/habits", icon: CheckSquare },
      { title: "Pomodoro Studio", href: "/pomodoro", icon: Timer },
      { title: "Growth Journey", href: "/journey", icon: Compass },
      { title: "Journal & Reflections", href: "/journal", icon: BookOpen },
      { title: "Consistency Calendar", href: "/calendar", icon: Calendar },
      { title: "Account & App Settings", href: "/settings", icon: Settings },
    ];

    pages.forEach((p) => {
      list.push({
        id: `nav-${p.href}`,
        title: p.title,
        category: "Navigation",
        icon: p.icon,
        action: () => {
          router.push(p.href);
          setIsOpen(false);
        },
      });
    });

    // 2. Active Habits
    if (habits && habits.length > 0) {
      habits.forEach((habit) => {
        const isDone = completedHabitIds.has(habit._id);
        list.push({
          id: `habit-${habit._id}`,
          title: habit.title,
          category: "Habits",
          icon: isDone ? CheckCircle2 : CheckSquare,
          subtitle: isDone ? "Completed today" : `Scheduled at ${habit.startTime}`,
          completed: isDone,
          action: () => {
            router.push("/habits");
            setIsOpen(false);
          },
        });
      });
    }

    // 3. Theme Palettes
    THEME_PALETTES.forEach((p) => {
      list.push({
        id: `theme-${p.id}`,
        title: `Theme: ${p.name}`,
        category: "Themes",
        icon: Palette,
        subtitle: p.description,
        action: () => {
          setPalette(p.id);
          setIsOpen(false);
        },
      });
    });

    // 4. Quick Actions
    list.push({
      id: "action-dark-light",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      category: "Actions",
      icon: theme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        setIsOpen(false);
      },
    });

    return list;
  }, [habits, completedHabitIds, router, setPalette, theme, toggleTheme]);

  // Filter items by search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Keyboard navigation within the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) selected.action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl glass-card rounded-3xl shadow-2xl overflow-hidden z-10 border border-[var(--border-subtle)]"
            style={{
              background: "color-mix(in srgb, var(--bg-elevated) 95%, transparent)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border-subtle)] gap-3">
              <Search size={18} className="text-[var(--accent)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search habits, pages, themes, or actions..."
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-[var(--text-tertiary)]"
                style={{ color: "var(--text-primary)" }}
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  No commands or habits found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-[var(--bg-hover)] translate-x-1"
                          : "hover:bg-[var(--bg-sunken)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected
                              ? "color-mix(in srgb, var(--accent) 20%, transparent)"
                              : "var(--bg-sunken)",
                            color: isSelected ? "var(--accent)" : "var(--text-secondary)",
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <span
                            className="text-xs font-semibold block truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span
                              className="text-[11px] block truncate"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-mono flex-shrink-0"
                        style={{
                          background: "var(--bg-sunken)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Tip */}
            <div className="px-4 py-2 bg-[var(--bg-sunken)]/60 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              <div className="flex items-center gap-2">
                <span>Use <kbd className="px-1 py-0.5 rounded bg-[var(--bg-elevated)] border text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[var(--bg-elevated)] border text-[10px]">↓</kbd> to navigate</span>
                <span>•</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border text-[10px]">↵</kbd> to select</span>
              </div>
              <div className="flex items-center gap-1">
                <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border text-[10px]">esc</kbd> to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
