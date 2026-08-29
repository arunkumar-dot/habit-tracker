"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "How is RoutineIQ different from typical habit apps?",
    answer:
      "Most apps treat habits like disconnected tasks on a checklist. RoutineIQ is built around identity psychology: you begin by defining who you want to become, grouping your daily rituals into natural time-of-day slots (Morning, Afternoon, Evening). As you complete habits, you see real-time 3D streak solids evolve, and our 'Then & Now' journal connects your past reflections with current momentum.",
  },
  {
    question: "Is RoutineIQ really 100% free with no paid tiers?",
    answer:
      "Yes. There are no locked analytics, no trial periods, and no premium subscriptions. RoutineIQ was built as an independent craft project to provide a high-quality, distraction-free habit space without commercial pressure.",
  },
  {
    question: "How do I install RoutineIQ on iOS or Android?",
    answer:
      "RoutineIQ is a full Progressive Web App (PWA). In iOS Safari, tap the Share icon and select 'Add to Home Screen'. In Android Chrome, tap the 3-dots menu and select 'Install app'. It launches fullscreen like a native app and works offline.",
  },
  {
    question: "How is my personal habit and reflection data secured?",
    answer:
      "All user data is isolated in secure cloud databases managed through cryptographic Clerk tokens. We never sell user data, embed third-party ad networks, or run invasive tracking pixels.",
  },
  {
    question: "Can I backfill or edit habits from previous days?",
    answer:
      "No. RoutineIQ enforces real-time daily accountability. Habits must be completed before midnight on the day they occur to count toward your streak. Past days are sealed as an honest historical record—if you miss a day, you reflect on what happened in your Journal and show up stronger today.",
  },
  {
    question: "Can I export or backup my data?",
    answer:
      "Yes. You can download a complete structured JSON export of all your habits, completion timestamps, streak achievements, and journal reflections anytime under Settings → Danger Zone in one click.",
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
            Clear answers to common questions.
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Everything you need to know about features, privacy, and mobile use.
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
