"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";

export function LandingCta() {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl p-8 sm:p-14 text-center overflow-hidden border border-[var(--border-default)] glass-card glow-card shadow-2xl">
          
          {/* Ambient radial lighting */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ background: "var(--accent)" }}
          />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
              style={{
                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)",
              }}
            >
              <Sparkles size={13} />
              <span>Begin Your Daily Ritual</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-5 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
              }}
            >
              Your future self is built <span className="italic">one day at a time</span>.
            </h2>

            <p className="text-base sm:text-lg mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              A calm, intentional space to reinforce who you want to become. 100% free with no ads, subscriptions, or paywalls.
            </p>

            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold shadow-xl shadow-[var(--accent)]/25 transition-all hover:scale-103 hover:shadow-[var(--accent)]/35 cursor-pointer"
              style={{
                background: "var(--accent)",
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              <span>Start Free Journey</span>
              <ArrowRight size={18} />
            </Link>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[var(--accent)]" />
                <span>No credit card required • Instant setup • 100% private</span>
              </div>
              <span className="hidden sm:inline" aria-hidden="true">•</span>
              <div className="flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500 fill-rose-500" />
                <span>Crafted for daily focus</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
