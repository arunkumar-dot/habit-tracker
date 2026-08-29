"use client";

import { Check, X, Sparkles } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Identity Framing vs. Plain Checklist",
    routineiq: "Connects every habit to who you want to become (Morning, Afternoon, Evening)",
    traditional: "Static list of checkboxes with no emotional grounding",
    highlight: true,
  },
  {
    feature: "Visual Streak Motivation",
    routineiq: "Interactive 3D crystals with real-time physics & milestone badges",
    traditional: "Flat streak numbers or generic flame icons",
    highlight: true,
  },
  {
    feature: "Past-Self Reflection ('Then & Now')",
    routineiq: "Automatic memory flashback cards showing past thoughts & growth",
    traditional: "No reflection tool or separate paid journaling apps",
    highlight: true,
  },
  {
    feature: "Built-In Deep Work Soundscapes",
    routineiq: "Generative ambient audio synthesizer (Rain, Waves, Ambient Tones)",
    traditional: "Requires separate subscription apps (Endel, Brain.fm)",
    highlight: false,
  },
  {
    feature: "Pricing & Paywalls",
    routineiq: "100% Free Forever with zero paywalls, premium tiers, or ads",
    traditional: "$40–$70/year subscriptions with locked core analytics",
    highlight: true,
  },
  {
    feature: "Data Privacy & Portability",
    routineiq: "Instant 1-click full JSON export & permanent account deletion",
    traditional: "Locked ecosystem, difficult or missing data export",
    highlight: false,
  },
];

export function LandingComparison() {
  return (
    <section id="comparison" className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Sparkles size={13} />
            <span>Why RoutineIQ</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            How RoutineIQ <span className="italic">compares</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            A side-by-side look at why intentional identity design beats generic productivity checklists.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-3xl glass-card glow-card border border-[var(--border-default)] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-sunken)]/60">
                  <th className="p-4 sm:p-5 font-semibold text-[var(--text-secondary)] w-1/3">
                    Feature / Capability
                  </th>
                  <th className="p-4 sm:p-5 font-bold text-[var(--accent)] w-1/3 bg-[var(--accent)]/5">
                    RoutineIQ
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-[var(--text-tertiary)] w-1/3">
                    Traditional Apps
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[var(--bg-hover)]/40 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-medium text-[var(--text-primary)] align-top">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-[var(--text-primary)] bg-[var(--accent)]/5 align-top">
                      <div className="flex items-start gap-2">
                        <Check size={16} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                        <span>{row.routineiq}</span>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-[var(--text-secondary)] align-top">
                      <div className="flex items-start gap-2">
                        <X size={16} className="text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
