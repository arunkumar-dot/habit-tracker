"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import { useTheme, THEME_PALETTES } from "@/components/providers/theme-provider";
import { useUser } from "@clerk/nextjs";

export function LandingNavbar() {
  const { theme, toggleTheme, palette, setPalette } = useTheme();
  const { isSignedIn, isLoaded } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)] shadow-xs"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2.5 group text-decoration-none">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs"
            style={{
              background: "var(--accent)",
              color: "#ffffff",
            }}
          >
            <Sparkles size={20} />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--text-primary)",
            }}
          >
            Routine<span style={{ color: "var(--accent)" }}>IQ</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <a
            href="#pillars"
            className="transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
          >
            Features
          </a>
          <a
            href="#comparison"
            className="transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
          >
            Why RoutineIQ
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
          >
            Pricing
          </a>
          <a
            href="#privacy"
            className="transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
          >
            Privacy
          </a>
          <a
            href="#faq"
            className="transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
          >
            FAQ
          </a>
        </nav>

        {/* Actions & Theme Swatches */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Palette Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPaletteMenuOpen(!paletteMenuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
              style={{
                background: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
              }}
              title="Change Theme Palette"
              aria-label="Palette switcher"
            >
              <div
                className="w-3.5 h-3.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
            </button>

            <AnimatePresence>
              {paletteMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 p-2 rounded-2xl glass-card border border-[var(--border-default)] shadow-xl grid grid-cols-3 gap-1.5 w-48 z-50"
                >
                  {THEME_PALETTES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPalette(p.id);
                        setPaletteMenuOpen(false);
                      }}
                      className="flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: palette === p.id ? "var(--bg-hover)" : "transparent",
                        border: palette === p.id ? "1px solid var(--accent)" : "1px solid transparent",
                      }}
                      title={p.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full shadow-xs"
                        style={{ background: theme === "dark" ? p.accentDark : p.accentLight }}
                      />
                      <span className="text-[10px] font-medium truncate w-full text-center" style={{ color: "var(--text-secondary)" }}>
                        {p.name.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: "var(--bg-sunken)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Auth Button */}
          {isLoaded && isSignedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all hover:opacity-90"
              style={{
                background: "var(--accent)",
                color: "#ffffff",
                textDecoration: "none",
              }}
            >
              <LayoutDashboard size={14} />
              <span>Go to App</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors hover:text-[var(--accent)]"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all hover:opacity-95 cursor-pointer"
                style={{
                  background: "var(--accent)",
                  color: "#ffffff",
                  textDecoration: "none",
                }}
              >
                <span>Start Free Journey</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--bg-sunken)",
              color: "var(--text-secondary)",
            }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--bg-sunken)",
              color: "var(--text-primary)",
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/95 backdrop-blur-2xl px-6 py-5 flex flex-col gap-4"
          >
            <a
              href="#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Features
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Why RoutineIQ
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Pricing
            </a>
            <a
              href="#privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              Privacy
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium py-1"
              style={{ color: "var(--text-primary)", textDecoration: "none" }}
            >
              FAQ
            </a>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2">
              {isLoaded && isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full py-3 text-center rounded-xl text-sm font-semibold shadow-xs"
                  style={{
                    background: "var(--accent)",
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="w-full py-3 text-center rounded-xl text-sm font-semibold shadow-xs"
                    style={{
                      background: "var(--accent)",
                      color: "#ffffff",
                      textDecoration: "none",
                    }}
                  >
                    Start Free Journey
                  </Link>
                  <Link
                    href="/sign-in"
                    className="w-full py-2.5 text-center rounded-xl text-sm font-medium"
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    Sign In to Existing Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
