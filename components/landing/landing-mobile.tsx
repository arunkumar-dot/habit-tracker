"use client";

import { Smartphone, Share, PlusSquare, MoreVertical, Download, Sparkles } from "lucide-react";

export function LandingMobile() {
  return (
    <section className="py-20 md:py-28 relative bg-[var(--bg-sunken)]/30 border-y border-[var(--border-subtle)]">
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
            <Smartphone size={13} />
            <span>Platform Availability</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Install instantly on <span className="italic">any device</span>.
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            RoutineIQ is a Progressive Web App (PWA) with native-like performance, offline caching, and zero App Store friction.
          </p>
        </div>

        {/* 2 OS Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* iOS Guide */}
          <div className="p-7 rounded-3xl glass-card border border-[var(--border-default)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div
                  className="px-3.5 py-1.5 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                    color: "var(--accent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  }}
                >
                  iOS
                </div>
                <div>
                  <h3 className="text-base font-semibold m-0 leading-snug" style={{ color: "var(--text-primary)" }}>
                    Apple iPhone & iPad
                  </h3>
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>Safari Browser</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 my-4">
                <div
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border"
                  style={{
                    background: "var(--bg-base)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <Share size={14} />
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <strong className="block mb-0.5 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Step 1: Tap Share
                    </strong>
                    <span>Open </span>
                    <code
                      className="text-[11px] px-1.5 py-0.5 rounded font-mono font-medium"
                      style={{ background: "var(--bg-sunken)", color: "var(--text-primary)" }}
                    >
                      tryhabitflow.com
                    </code>
                    <span> in Safari and tap the Share button.</span>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border"
                  style={{
                    background: "var(--bg-base)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <PlusSquare size={14} />
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <strong className="block mb-0.5 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Step 2: Add to Home Screen
                    </strong>
                    <span>Select </span>
                    <em className="not-italic font-medium" style={{ color: "var(--text-primary)" }}>
                      &quot;Add to Home Screen&quot;
                    </em>
                    <span> to launch in standalone fullscreen app mode.</span>
                  </div>
                </div>
              </div>
            </div>

            <span className="text-[11px] text-center block pt-3 border-t border-[var(--border-subtle)]" style={{ color: "var(--text-tertiary)" }}>
              Supports offline caching & lockscreen launch
            </span>
          </div>

          {/* Android Guide */}
          <div className="p-7 rounded-3xl glass-card border border-[var(--border-default)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div
                  className="px-3.5 py-1.5 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                    color: "var(--accent)",
                    border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                  }}
                >
                  Android
                </div>
                <div>
                  <h3 className="text-base font-semibold m-0 leading-snug" style={{ color: "var(--text-primary)" }}>
                    Android Phones & Tablets
                  </h3>
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>Chrome or Brave Browser</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 my-4">
                <div
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border"
                  style={{
                    background: "var(--bg-base)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <MoreVertical size={14} />
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <strong className="block mb-0.5 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Step 1: Open Menu
                    </strong>
                    <span>Open </span>
                    <code
                      className="text-[11px] px-1.5 py-0.5 rounded font-mono font-medium"
                      style={{ background: "var(--bg-sunken)", color: "var(--text-primary)" }}
                    >
                      tryhabitflow.com
                    </code>
                    <span> and tap the 3-dots browser menu.</span>
                  </div>
                </div>

                <div
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl border"
                  style={{
                    background: "var(--bg-base)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: "color-mix(in srgb, var(--accent) 15%, transparent)",
                      color: "var(--accent)",
                    }}
                  >
                    <Download size={14} />
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <strong className="block mb-0.5 font-semibold" style={{ color: "var(--text-primary)" }}>
                      Step 2: Tap Install App
                    </strong>
                    <span>Tap </span>
                    <em className="not-italic font-medium" style={{ color: "var(--text-primary)" }}>
                      &quot;Install App&quot;
                    </em>
                    <span> or </span>
                    <em className="not-italic font-medium" style={{ color: "var(--text-primary)" }}>
                      &quot;Add to Home Screen&quot;
                    </em>
                    <span> for instant setup.</span>
                  </div>
                </div>
              </div>
            </div>

            <span className="text-[11px] text-center block pt-3 border-t border-[var(--border-subtle)]" style={{ color: "var(--text-tertiary)" }}>
              Includes Web Push notifications & offline service worker
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
