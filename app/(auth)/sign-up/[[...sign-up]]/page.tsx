import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SignUp appearance={clerkDarkAppearance} forceRedirectUrl="/dashboard" />

      {/* Legal acceptance notice — Clerk has no native slot for this */}
      <p className="text-xs text-center max-w-xs" style={{ color: "var(--text-tertiary)" }}>
        By signing up, you agree to our{" "}
        <Link
          href="/legal/terms"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy"
          className="underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-secondary)" }}
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
