'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function RootPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    router.replace(isSignedIn ? "/dashboard" : "/sign-in");
  }, [isSignedIn, isLoaded, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
      }}
    >
      <Spinner size="lg" className="text-terracotta" />
    </div>
  );
}
