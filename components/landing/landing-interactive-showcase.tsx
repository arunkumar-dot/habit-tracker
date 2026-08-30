"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Flame,
  CheckCircle2,
  Sparkles,
  Timer,
  BookOpen,
  TrendingUp,
  Radio,
  Calendar,
  Volume2,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";

type ShowcaseTab = "today" | "pomodoro" | "journey" | "journal";

export function LandingInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("today");

  // Interactive state for Today demo
  const [completedDemoHabits, setCompletedDemoHabits] = useState<Record<string, boolean>>({
    h1: true,
    h2: false,
    h3: false,
  });

  const toggleDemoHabit = (id: string) => {
    setCompletedDemoHabits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="showcase" className="py-20 md:py-28 relative bg-[var(--bg-sunken)]/30 border-y border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Sparkles size={13} />
            <span>Interactive Experience</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Designed with <span className="italic">tactile beauty</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Explore the core views that make maintaining daily habits effortless and inspiring.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {[
            { id: "today" as const, label: "Today Dashboard", icon: Sun },
            { id: "pomodoro" as const, label: "Pomodoro Studio", icon: Timer },
            { id: "journey" as const, label: "Growth Journey", icon: TrendingUp },
            { id: "journal" as const, label: "Memory Journal", icon: BookOpen },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-xs"
                style={{
                  background: isSelected ? "var(--accent)" : "var(--bg-elevated)",
                  color: isSelected ? "#ffffff" : "var(--text-secondary)",
                  border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border-default)",
                }}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Window */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-card glow-card border border-[var(--border-default)] shadow-2xl overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait">
            
            {/* 1. TODAY DASHBOARD SHOWCASE */}
            {activeTab === "today" && (
              <motion.div
                key="today"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Simulated Identity Card */}
                <div className="rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-base)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles size={13} className="text-[var(--accent)]" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                        Daily Identity Anchor
                      </span>
                    </div>
                    <p className="text-xl sm:text-2xl font-normal italic" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                      &ldquo;Every action is a vote for who you wish to become.&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent)]/15 text-[var(--accent)] flex items-center gap-1">
                        <Flame size={13} className="fill-[var(--accent)]" />
                        <span>12 Day Streak</span>
                      </div>
                      <span className="text-xs text-[var(--text-tertiary)]">Best streak: 21 days</span>
                    </div>
                  </div>

                  <div className="text-xs px-3 py-1.5 rounded-xl bg-[var(--bg-sunken)] text-[var(--text-secondary)] font-medium">
                    Try checking off a habit below ⬇️
                  </div>
                </div>

                {/* Simulated Habit Group */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Morning Routine (Click to toggle)
                  </span>

                  {[
                    { id: "h1", title: "Morning 5K run & stretch", time: "06:30 AM", color: "#C2410C" },
                    { id: "h2", title: "Deep reading (20 pages)", time: "07:30 AM", color: "#8B5CF6" },
                    { id: "h3", title: "Write 500 words draft", time: "08:15 AM", color: "#059669" },
                  ].map((habit) => {
                    const done = completedDemoHabits[habit.id];
                    return (
                      <button
                        key={habit.id}
                        type="button"
                        onClick={() => toggleDemoHabit(habit.id)}
                        className="flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer text-left w-full"
                        style={{
                          background: done ? "color-mix(in srgb, var(--accent) 8%, var(--bg-elevated))" : "var(--bg-elevated)",
                          borderColor: done ? "var(--accent)" : "var(--border-default)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                            style={{
                              background: done ? "var(--accent)" : "var(--bg-sunken)",
                              color: done ? "#ffffff" : "transparent",
                              border: done ? "none" : "1.5px solid var(--border-default)",
                            }}
                          >
                            <Check size={14} className={done ? "opacity-100" : "opacity-0"} />
                          </div>
                          <div>
                            <p
                              className="text-sm font-semibold m-0 transition-all"
                              style={{
                                color: done ? "var(--text-secondary)" : "var(--text-primary)",
                                textDecoration: done ? "line-through" : "none",
                              }}
                            >
                              {habit.title}
                            </p>
                            <span className="text-xs text-[var(--text-tertiary)]">{habit.time}</span>
                          </div>
                        </div>

                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            background: done ? "var(--success)/15" : "var(--bg-sunken)",
                            color: done ? "var(--success)" : "var(--text-tertiary)",
                          }}
                        >
                          {done ? "Completed ✓" : "Pending"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* 2. POMODORO STUDIO SHOWCASE */}
            {activeTab === "pomodoro" && (
              <motion.div
                key="pomodoro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6 items-center text-center"
              >
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-sunken)]">
                  <span className="px-4 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold">
                    Deep Focus (25m)
                  </span>
                  <span className="px-4 py-1.5 rounded-xl text-[var(--text-secondary)] text-xs font-medium">
                    Short Break (5m)
                  </span>
                  <span className="px-4 py-1.5 rounded-xl text-[var(--text-secondary)] text-xs font-medium">
                    Long Break (15m)
                  </span>
                </div>

                <div className="flex flex-col items-center my-2">
                  <span className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-[var(--text-primary)]">
                    24:58
                  </span>
                  <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold mt-2">
                    Linked to: Morning 5K Run & Stretch
                  </span>
                </div>

                {/* Zen Soundscape Simulator */}
                <div className="w-full rounded-2xl p-4 border border-[var(--border-subtle)] bg-[var(--bg-base)] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)]">
                      <Volume2 size={16} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[var(--text-primary)] m-0">
                        Zen Soundscapes Active
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)] m-0">
                        Playing Calm Ambient Focus Tone (Zen Alpha)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--accent)] text-white font-semibold">
                    Active ●
                  </span>
                </div>
              </motion.div>
            )}

            {/* 3. GROWTH JOURNEY SHOWCASE */}
            {activeTab === "journey" && (
              <motion.div
                key="journey"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                    <span className="text-2xl font-bold text-[var(--accent)] block">142</span>
                    <span className="text-xs text-[var(--text-tertiary)]">Total Completions</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                    <span className="text-2xl font-bold text-[var(--text-primary)] block">48</span>
                    <span className="text-xs text-[var(--text-tertiary)]">Active Days</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                    <span className="text-2xl font-bold text-amber-500 block">21</span>
                    <span className="text-xs text-[var(--text-tertiary)]">Best Streak</span>
                  </div>
                </div>

                {/* Simulated Heatmap */}
                <div className="p-4 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <span className="text-xs font-semibold text-[var(--text-primary)] mb-3 block">
                    Consistency Year Matrix
                  </span>
                  <div className="grid grid-cols-16 sm:grid-cols-24 gap-1.5">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const active = (i * 7 + 3) % 5 > 1;
                      return (
                        <div
                          key={i}
                          className="h-3 rounded-xs"
                          style={{
                            background: active ? "var(--accent)" : "var(--bg-sunken)",
                            opacity: active ? (i % 3 === 0 ? 0.9 : 0.6) : 0.3,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. MEMORY JOURNAL SHOWCASE */}
            {activeTab === "journal" && (
              <motion.div
                key="journal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                {/* Past-Self Flashback Card */}
                <div className="rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                      ⚡ Then — 30 Days Ago
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">July 31</span>
                  </div>
                  <p className="text-sm italic font-normal text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    &ldquo;Felt resistant about waking up early today, but I promised myself 10 minutes of journaling. I feel much clearer now.&rdquo;
                  </p>
                </div>

                {/* Today's Reflection */}
                <div className="rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-base)]">
                  <span className="text-xs uppercase tracking-wider font-bold text-[var(--accent)] mb-2 block">
                    ✍️ Today&apos;s Entry
                  </span>
                  <p className="text-sm font-normal text-[var(--text-secondary)]">
                    Woke up without an alarm. The morning routine is now second nature. Completed all 3 focus blocks before lunch.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
