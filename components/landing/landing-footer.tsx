"use client";

import Link from "next/link";
import { Sparkles, Mail, Heart } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-sunken)]/40 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Creator Note */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                }}
              >
                <Sparkles size={16} />
              </div>
              <span
                className="text-base font-bold tracking-tight"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-primary)",
                }}
              >
                Routine<span style={{ color: "var(--accent)" }}>IQ</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] m-0">
              Identity-first daily habit mastery & reflection.
            </p>
          </div>

          {/* Nav & Contact Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            <a href="#pillars" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              Features
            </a>
            <a href="#comparison" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              Why RoutineIQ
            </a>
            <a href="#pricing" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              Pricing
            </a>
            <a href="#privacy" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="#faq" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              FAQ
            </a>
            <a
              href="mailto:arunkulkarni2000@gmail.com"
              className="inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Mail size={13} />
              <span>Contact Support</span>
            </a>
            <Link href="/legal/privacy" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-[var(--accent)] transition-colors" style={{ color: "inherit", textDecoration: "none" }}>
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs m-0" style={{ color: "var(--text-tertiary)" }}>
            © {new Date().getFullYear()} RoutineIQ. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
