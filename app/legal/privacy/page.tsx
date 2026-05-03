import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — HabitFlow",
};

export default function PrivacyPolicyPage() {
  return <LegalPage filename="privacy.mdx" />;
}
