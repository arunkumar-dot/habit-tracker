"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const FREE_FEATURES = [
  "Unlimited daily habits & custom time-of-day slots",
  "Interactive 3D streak crystals with dynamic physics",
  "Pomodoro focus studio with ambient sound generator",
  "Past-self reflection journal ('Then & Now' flashbacks)",
  "Real-time cloud sync with instant sub-100ms updates",
  "Works offline with standalone Progressive Web App (PWA)",
  "Full structured JSON export & 100% data portability",
  "6 curated visual themes and 3D background styles",
  "Zero advertisements, tracking scripts, or data sales",
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 relative bg-[var(--bg-sunken)]/30 border-y border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Sparkles size={13} />
            <span>Transparent Pricing</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Simple, honest, and <span className="italic">100% free</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            No trials. No locked analytics tiers. No surprise credit card charges.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-3xl mx-auto rounded-3xl glass-card glow-card border border-[var(--border-default)] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "var(--accent)" }}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] m-0">
                  Full Access Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent)] text-white">
                  Current & Future
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] m-0">
                Complete access to all core habit mechanics, 3D crystals, and focus tools.
              </p>
            </div>

            <div className="text-left sm:text-right flex-shrink-0">
              <span className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] tracking-tight">
                $0
              </span>
              <span className="text-xs text-[var(--text-tertiary)] block mt-1">
                Free forever • No card needed
              </span>
            </div>
          </div>

          {/* Included Feature Grid */}
          <div className="py-8">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
              Everything Included:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {FREE_FEATURES.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)] flex-shrink-0">
                    <Check size={12} className="stroke-[2.5]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why It's Free Explainer & CTA */}
          <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[var(--text-tertiary)] leading-relaxed text-left">
              <span className="font-semibold text-[var(--text-secondary)]">Why is it free?</span> RoutineIQ was built as an independent craft project to provide a calm, ad-free habit ritual without commercial pressure.
            </div>

            <Link
              href="/sign-up"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold shadow-md transition-all hover:opacity-95 whitespace-nowrap flex-shrink-0"
              style={{
                background: "var(--accent)",
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              <span>Start Free Journey</span>
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
