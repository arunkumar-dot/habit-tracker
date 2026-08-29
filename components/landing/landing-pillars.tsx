"use client";

import { motion } from "framer-motion";
import { Sparkles, Compass, Brain, Headphones, Flame, Clock, BookOpen, Layers } from "lucide-react";

const PILLARS = [
  {
    icon: Compass,
    tag: "Pillar 01 — Identity",
    title: "Identity-Based Daily Rituals",
    description:
      "Inspired by James Clear's Atomic Habits: you don't rise to the level of your goals, you fall to the level of your systems. Design who you want to become, not just tasks to check off.",
    highlights: ["Time-of-day habit grouping (Morning, Afternoon, Evening)", "Daily identity statement visual anchor", "Single-tap completions with crystal sound chimes"],
    badgeColor: "var(--accent)",
  },
  {
    icon: Flame,
    tag: "Pillar 02 — Visual Engine",
    title: "Generative 3D Streak Crystals",
    description:
      "Transform consistency into a living artifact. Real-time Three.js WebGL crystals that evolve facet complexity, refraction index, and ember halos as your active streak compounds.",
    highlights: ["Interactive cursor physics & perspective tilt", "6 curated chromatic theme palettes", "Permanent milestone achievements at 3, 7, 21, and 66 days"],
    badgeColor: "#F59E0B",
  },
  {
    icon: BookOpen,
    tag: "Pillar 03 — Memory",
    title: "Past-Self Reflection System",
    description:
      "The 'Then & Now' memory mechanism. Automatic flashback cards surface what your past self felt 7 or 30 days ago, giving you tangible proof of psychological growth.",
    highlights: ["Distraction-free quick daily reflections", "Resurfacing memories to beat imposter syndrome", "Intimate, fully encrypted local & cloud storage"],
    badgeColor: "#8B5CF6",
  },
  {
    icon: Headphones,
    tag: "Pillar 04 — Flow State",
    title: "Spatial Focus Soundscapes",
    description:
      "Integrated Web Audio synthesizer providing zero-distraction ambient frequencies. Pair focused Pomodoro sessions directly with deep-work soundscapes.",
    highlights: ["10Hz Alpha binaural brainwave entrainment", "Pink noise soft rain & modulated wave LFOs", "F-minor 432Hz ambient chord drones"],
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
            <span>The RoutineIQ Framework</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Built on four pillars of <span className="italic">lasting transformation</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Standard habit trackers fail because they treat you like a spreadsheet. RoutineIQ treats you like a person designing a lifelong identity.
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

              {/* Highlights checklist */}
              <div className="pt-5 border-t border-[var(--border-subtle)] flex flex-col gap-2.5">
                {p.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: p.badgeColor }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
