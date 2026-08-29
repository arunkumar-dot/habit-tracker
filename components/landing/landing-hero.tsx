"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Flame, CheckCircle2, Play } from "lucide-react";
import { ThreeStreakCrystal } from "@/components/3d/three-streak-crystal";

const DEMO_MILESTONES = [
  { days: 1, label: "Day 1 (Initiate)" },
  { days: 3, label: "Day 3 (Sprout)" },
  { days: 7, label: "Day 7 (Momentum)" },
  { days: 30, label: "Day 30 (Identity)" },
];

export function LandingHero() {
  const [demoStreak, setDemoStreak] = useState(7);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-[var(--border-default)] shadow-xs"
              style={{
                background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Sparkles size={13} className="text-[var(--accent)]" />
              <span>Identity-First Habit Mastery</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.12] mb-6"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              Don&apos;t just track habits.{" "}
              <span className="italic font-normal underline decoration-[var(--accent)]/40 decoration-wavy decoration-2 underline-offset-8">
                Become the person
              </span>{" "}
              you designed.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base sm:text-lg max-w-xl leading-relaxed mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              RoutineIQ unites James Clear&apos;s atomic identity loops, generative 3D habit crystals, 
              past-self reflection memories, and spatial ambient soundscapes into one distraction-free daily ritual.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10"
            >
              <Link
                href="/sign-up"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold shadow-lg shadow-[var(--accent)]/20 transition-all hover:scale-102 hover:shadow-[var(--accent)]/30 cursor-pointer"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <span>Start Your Journey Free</span>
                <ArrowRight size={17} />
              </Link>
              
              <a
                href="#showcase"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold glass-card border border-[var(--border-default)] transition-all hover:bg-[var(--bg-hover)]"
                style={{
                  color: "var(--text-primary)",
                  textDecoration: "none",
                }}
              >
                <Play size={14} className="fill-[var(--text-primary)]" />
                <span>See How It Works</span>
              </a>
            </motion.div>

            {/* Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[var(--accent)]" />
                <span>Zero Ads or Paywalls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={15} className="text-[var(--accent)]" />
                <span>100% Private & Exportable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={15} className="text-[var(--accent)]" />
                <span>Works Offline (PWA)</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Live Interactive 3D Crystal Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="relative w-full max-w-sm rounded-3xl glass-card glow-card p-6 sm:p-7 border border-[var(--border-default)] shadow-2xl overflow-hidden">
              {/* Radial glow backdrop */}
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ background: "var(--accent)" }}
              />

              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Flame size={15} className="text-[var(--accent)]" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    Interactive 3D Crystal
                  </span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-sunken)] font-mono" style={{ color: "var(--text-tertiary)" }}>
                  Live WebGL
                </span>
              </div>

              <h3 className="text-lg font-normal mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                &ldquo;A Disciplined Athlete&rdquo;
              </h3>
              <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                Crystals evolve their facets, refraction, and ember halo as your streak grows.
              </p>

              {/* 3D Crystal Container */}
              <div className="flex items-center justify-center my-2 h-[190px] relative">
                <ThreeStreakCrystal streak={demoStreak} size={210} />
              </div>

              {/* Interactive Milestone Selector */}
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                  Try a streak level:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_MILESTONES.map((m) => (
                    <button
                      key={m.days}
                      type="button"
                      onClick={() => setDemoStreak(m.days)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
                      style={{
                        background: demoStreak === m.days
                          ? "var(--accent)"
                          : "var(--bg-sunken)",
                        color: demoStreak === m.days
                          ? "#ffffff"
                          : "var(--text-secondary)",
                        border: demoStreak === m.days
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border-subtle)",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
