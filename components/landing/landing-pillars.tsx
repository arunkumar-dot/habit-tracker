"use client";

import { motion } from "framer-motion";
import { Compass, Flame, BookOpen, Headphones, Layers } from "lucide-react";

const PILLARS = [
  {
    icon: Compass,
    tag: "Core Foundation",
    title: "Identity-Based Daily Habits",
    description:
      "True habit change begins with self-image. Rather than maintaining an endless to-do list, define who you want to become and link your morning, afternoon, and evening rituals directly to that identity.",
    highlights: [
      "Time-of-day habit grouping (Morning, Afternoon, Evening)",
      "Daily identity statement visual anchor on your dashboard",
      "Single-tap completions with optional crystal audio chimes",
    ],
    badgeColor: "var(--accent)",
    footnote: "Inspired by habit formation psychology (independent and not affiliated with James Clear or Atomic Habits).",
  },
  {
    icon: Flame,
    tag: "Visual Progress",
    title: "Living 3D Streak Solids",
    description:
      "Transform consistency into something you can actually see and interact with. Your streak renders as a dynamic Three.js 3D solid that evolves its geometry, lighting, and ambient embers as you show up.",
    highlights: [
      "Real-time pointer tilt & physics on desktop and touchscreens",
      "6 curated color palettes to match your mood or theme",
      "Milestone badges celebrating 3, 7, 21, and 66 days of consistency",
    ],
    badgeColor: "#F59E0B",
  },
  {
    icon: BookOpen,
    tag: "Reflection",
    title: "Past-Self Reflection Journal",
    description:
      "Capture quick daily thoughts without clutter. Our 'Then & Now' feature automatically resurfaces what you wrote weeks or months ago so you can see tangible evidence of your personal growth.",
    highlights: [
      "Distraction-free daily reflection prompt",
      "Automatic memory cards surfacing past reflections",
      "Export your entire journal archive anytime in structured JSON",
    ],
    badgeColor: "#8B5CF6",
  },
  {
    icon: Headphones,
    tag: "Deep Work",
    title: "Generative Focus Soundscapes",
    description:
      "A built-in ambient audio synthesizer designed to block outside noise during Pomodoro focus blocks. Runs entirely in your browser using the Web Audio API with zero audio files to download.",
    highlights: [
      "Gentle filtered rain texture & rhythmic ocean wind waves",
      "Warm harmonic drone chords and dual-frequency alpha focus tones",
      "Individual volume sliders and one-tap timer integration",
    ],
    badgeColor: "#10B981",
  },
];

export function LandingPillars() {
  return (
    <section id="pillars" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Layers size={13} />
            <span>Product Highlights</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Designed for <span className="italic">daily clarity</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Everything you need to build steady routines, stay focused, and reflect on your progress—without ads, clutter, or paywalls.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PILLARS.map((p, idx) => (
            <motion.div
              key={p.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-7 sm:p-8 border border-[var(--border-default)] flex flex-col justify-between hover:border-[var(--accent)]/40 transition-all group"
            >
              <div>
                {/* Header icon & tag */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                    style={{
                      background: `color-mix(in srgb, ${p.badgeColor} 15%, transparent)`,
                      color: p.badgeColor,
                    }}
                  >
                    <p.icon size={22} />
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-[var(--bg-sunken)]" style={{ color: "var(--text-tertiary)" }}>
                    {p.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <h3
                  className="text-xl sm:text-2xl font-normal mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--text-primary)",
                  }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  {p.description}
                </p>
              </div>

              {/* Highlights checklist & Footnote */}
              <div>
                <div className="pt-5 border-t border-[var(--border-subtle)] flex flex-col gap-2.5">
                  {p.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: p.badgeColor }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {p.footnote && (
                  <p className="text-[11px] mt-4 pt-3 border-t border-[var(--border-subtle)]" style={{ color: "var(--text-tertiary)" }}>
                    * {p.footnote}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
