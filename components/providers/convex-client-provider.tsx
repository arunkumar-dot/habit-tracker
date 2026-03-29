"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";

/** Singleton Convex client — initialized once at module level. */
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

/**
 * Wraps the app with the Convex provider, integrated with Clerk auth.
 * The Convex client automatically sends the Clerk JWT with every
 * query and mutation, which Convex validates server-side.
 *
 * Must be inside <ClerkProvider>.
 */
export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
