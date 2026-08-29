"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "How is RoutineIQ different from typical habit trackers?",
    answer:
      "Most habit apps treat you like a project manager tracking a checklist. RoutineIQ is built around James Clear's atomic identity philosophy: you start by designing who you want to become. Your habits evolve into interactive 3D streak crystals, and our 'Then & Now' journal connects your past reflections with current momentum.",
  },
  {
    question: "Is RoutineIQ completely free to use?",
    answer:
      "Yes! All core habit tracking, time-of-day groupings, interactive 3D streak crystals, Pomodoro focus timer, ambient soundscapes, and full data exports are 100% free with no paywalls or intrusive advertisements.",
  },
  {
    question: "Can I install RoutineIQ as an app on my phone?",
    answer:
      "Absolutely. RoutineIQ is a Progressive Web App (PWA). In iOS Safari, tap Share → 'Add to Home Screen'. In Android Chrome, tap the install banner or browser menu. It opens in standalone fullscreen mode and works offline with background service workers.",
  },
  {
    question: "How is my habit and journal data secured?",
    answer:
      "Your data is protected by enterprise-grade Clerk authentication and stored in secure Convex cloud instances. Data is strictly isolated by cryptographic user tokens. We never sell your data or serve ads.",
  },
  {
    question: "Can I export or backup my habit records?",
    answer:
      "Yes, anytime. Under Settings → Danger Zone, you can download a complete structured JSON export of all your habits, daily completion timestamps, streak achievements, and journal entries in one click.",
  },
];

export function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              color: "var(--accent)",
            }}
          >
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-normal tracking-tight mb-3"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-primary)",
            }}
          >
            Everything you need to know.
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Clear answers about features, privacy, and mobile installation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-card border border-[var(--border-default)] overflow-hidden transition-colors"
                style={{
                  borderColor: isOpen ? "var(--accent)" : "var(--border-default)",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors bg-transparent border-0"
                >
                  <span className="text-base font-semibold pr-4" style={{ color: "var(--text-primary)" }}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                    style={{ color: isOpen ? "var(--accent)" : "var(--text-tertiary)" }}
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 text-sm leading-relaxed border-t border-[var(--border-subtle)] pt-3" style={{ color: "var(--text-secondary)" }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
