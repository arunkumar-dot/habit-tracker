'use client';

import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

function SignInForm() {
  const searchParams = useSearchParams();
  const rawRedirectUrl = searchParams.get("redirect_url");
  // If redirect_url is absent or is the landing page root, send user directly into the app
  const redirectUrl = rawRedirectUrl && rawRedirectUrl !== "/" ? rawRedirectUrl : "/dashboard";

  return (
    <SignIn
      appearance={clerkDarkAppearance}
      fallbackRedirectUrl={redirectUrl}
      forceRedirectUrl={redirectUrl}
    />
  );
}

export function SignInContent() {
  return (
    <Suspense
      fallback={
        <SignIn
          appearance={clerkDarkAppearance}
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        />
      }
    >
      <SignInForm />
    </Suspense>
  );
}

