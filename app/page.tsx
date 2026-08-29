"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import { ThreeAmbientCanvas } from "@/components/3d/three-ambient-canvas";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { LandingInteractiveShowcase } from "@/components/landing/landing-interactive-showcase";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  const { isSignedIn, isLoaded, user } = useUser();

  return (
    <div
      className="min-h-screen relative flex flex-col overflow-x-hidden selection:bg-[var(--accent)] selection:text-white"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Dynamic 3D Ambient Background Canvas */}
      <ThreeAmbientCanvas intensity={0.75} />

      {/* Floating Banner for Authenticated Users */}
      {isLoaded && isSignedIn && (
        <div className="relative z-50 bg-[var(--accent)] text-white text-xs font-semibold px-4 py-2 flex items-center justify-center gap-2 text-center">
          <Sparkles size={14} />
          <span>Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! You are signed in.</span>
          <Link
            href="/dashboard"
            className="underline inline-flex items-center gap-1 ml-2 font-bold hover:opacity-90"
            style={{ color: "#ffffff" }}
          >
            <span>Open Dashboard</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Content Flow */}
      <main className="relative z-10 flex-1">
        <LandingHero />
        <LandingPillars />
        <LandingInteractiveShowcase />
        <LandingFaq />
        <LandingCta />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
