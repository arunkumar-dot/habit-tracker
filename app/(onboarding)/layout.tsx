import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started — HabitFlow",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-full"
      style={{ background: "var(--bg-base)" }}
    >
      {children}
    </div>
  );
}
