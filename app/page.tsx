'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/dashboard" : "/sign-in");
  }, [isSignedIn, isLoaded, router]);

  return null;
}
