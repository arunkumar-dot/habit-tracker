'use client';

import { Suspense } from "react";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

function SignUpForm() {
  const searchParams = useSearchParams();
  const rawRedirectUrl = searchParams.get("redirect_url");
  const redirectUrl = rawRedirectUrl && rawRedirectUrl !== "/" ? rawRedirectUrl : "/dashboard";

  return (
    <SignUp
      appearance={clerkDarkAppearance}
      fallbackRedirectUrl={redirectUrl}
      forceRedirectUrl={redirectUrl}
    />
  );
}

export function SignUpContent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Suspense
        fallback={
          <SignUp
            appearance={clerkDarkAppearance}
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          />
        }
      >
        <SignUpForm />
      </Suspense>

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

