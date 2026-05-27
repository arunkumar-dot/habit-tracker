'use client';

import { SignIn } from "@clerk/nextjs";
import { clerkDarkAppearance } from "@/lib/clerk-appearance";

export function SignInContent() {
  return <SignIn appearance={clerkDarkAppearance} />;
}
