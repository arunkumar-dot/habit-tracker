"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
import { ThreeAmbientCanvas } from "@/components/3d/three-ambient-canvas";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { LandingInteractiveShowcase } from "@/components/landing/landing-interactive-showcase";
import { LandingComparison } from "@/components/landing/landing-comparison";
import { LandingPricing } from "@/components/landing/landing-pricing";
import { LandingPrivacy } from "@/components/landing/landing-privacy";
import { LandingMobile } from "@/components/landing/landing-mobile";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && isSignedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-base)" }}
      >
        <Spinner size="lg" className="text-terracotta" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative flex flex-col overflow-x-hidden selection:bg-[var(--accent)] selection:text-white"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Dynamic 3D Ambient Background Canvas */}
      <ThreeAmbientCanvas intensity={0.75} />

      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Content Flow */}
      <main className="relative z-10 flex-1">
        <LandingHero />
        <LandingPillars />
        <LandingInteractiveShowcase />
        <LandingComparison />
        <LandingPricing />
        <LandingPrivacy />
        <LandingMobile />
        <LandingFaq />
        <LandingCta />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
