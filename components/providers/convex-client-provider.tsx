"use client";

import { useState } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

/**
 * Wraps the app with the Convex provider, integrated with Clerk auth.
 * The client is created lazily inside the component so that pages which
 * don't use Convex (e.g. the 404 page) can still prerender at build time
 * even when NEXT_PUBLIC_CONVEX_URL is not set in the build environment.
 *
 * Must be inside <ClerkProvider>.
 */
export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [convex] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    return new ConvexReactClient(url);
  });

  if (!convex) return <>{children}</>;

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
