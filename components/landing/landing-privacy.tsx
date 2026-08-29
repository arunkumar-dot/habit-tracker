"use client";

import { Shield, Lock, Download, Trash2, CheckCircle2 } from "lucide-react";

const PRIVACY_ITEMS = [
  {
    icon: Lock,
    title: "Isolated Cryptographic Storage",
    desc: "Your habits and private reflections are isolated in enterprise cloud databases, accessible only via verified Clerk authentication tokens.",
  },
  {
    icon: Shield,
    title: "Zero Ads & Zero Ad Trackers",
    desc: "We do not sell personal data, display intrusive third-party banner ads, or embed aggressive tracking pixels.",
  },
  {
    icon: Download,
    title: "1-Click Full JSON Export",
    desc: "Your data belongs to you. Download a complete structured backup of all your habits, timestamps, streaks, and reflections at any time.",
  },
  {
    icon: Trash2,
    title: "Instant Permanent Deletion",
    desc: "Want to wipe your footprint? Delete your entire account and all associated cloud data instantly under Settings in a single step.",
  },
];

export function LandingPrivacy() {
  return (
    <section id="privacy" className="py-20 md:py-28 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Shield size={13} />
            <span>Security & Privacy</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Your thoughts stay <span className="italic">yours</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            A habit tracker and journal holds personal intentions. Here is how we ensure complete data integrity and privacy.
          </p>
        </div>

        {/* 4 Privacy Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRIVACY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-card border border-[var(--border-default)] flex items-start gap-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
                style={{
                  background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
