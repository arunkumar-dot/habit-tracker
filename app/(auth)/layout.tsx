import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Sign In — HabitFlow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col px-4"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background gradient effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(194,65,12,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Centered auth card */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo / App name */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
              style={{ background: "var(--accent)" }}
            >
              <span className="text-white text-xl font-bold">H</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              HabitFlow
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Build better habits, one day at a time.
            </p>
          </div>

          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
