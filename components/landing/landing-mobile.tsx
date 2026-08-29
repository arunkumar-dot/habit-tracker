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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-sunken)] text-[var(--text-primary)] font-bold text-sm">
                  iOS
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] m-0">
                    Apple iPhone & iPad
                  </h3>
                  <span className="text-xs text-[var(--text-tertiary)]">Safari Browser</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 my-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)] flex-shrink-0 mt-0.5">
                    <Share size={13} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)] block">Step 1: Tap Share</strong>
                    Open <code className="text-[11px] px-1 py-0.5 rounded bg-[var(--bg-sunken)]">tryhabitflow.com</code> in Safari and tap the Share button.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)] flex-shrink-0 mt-0.5">
                    <PlusSquare size={13} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)] block">Step 2: Add to Home Screen</strong>
                    Select <em>&quot;Add to Home Screen&quot;</em> to launch in standalone fullscreen app mode.
                  </div>
                </div>
              </div>
            </div>

            <span className="text-[11px] text-[var(--text-tertiary)] text-center block pt-2">
              Supports offline caching & lockscreen launch
            </span>
          </div>

          {/* Android Guide */}
          <div className="p-7 rounded-3xl glass-card border border-[var(--border-default)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-sunken)] text-[var(--text-primary)] font-bold text-sm">
                  Android
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] m-0">
                    Android Phones & Tablets
                  </h3>
                  <span className="text-xs text-[var(--text-tertiary)]">Chrome or Brave Browser</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 my-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)] flex-shrink-0 mt-0.5">
                    <MoreVertical size={13} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)] block">Step 1: Open Menu</strong>
                    Open <code className="text-[11px] px-1 py-0.5 rounded bg-[var(--bg-sunken)]">tryhabitflow.com</code> and tap the 3-dots browser menu.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)]">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[var(--accent)]/15 text-[var(--accent)] flex-shrink-0 mt-0.5">
                    <Download size={13} />
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <strong className="text-[var(--text-primary)] block">Step 2: Tap Install App</strong>
                    Tap <em>&quot;Install App&quot;</em> or <em>&quot;Add to Home Screen&quot;</em> for instant setup.
                  </div>
                </div>
              </div>
            </div>

            <span className="text-[11px] text-[var(--text-tertiary)] text-center block pt-2">
              Includes Web Push notifications & offline service worker
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
