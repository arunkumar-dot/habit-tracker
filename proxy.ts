import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/timeline(.*)",
  "/calendar(.*)",
  "/analytics(.*)",
  "/habits(.*)",
  "/settings(.*)",
  "/journal(.*)",
  "/pomodoro(.*)",
]);

/**
 * Next.js 16 Proxy (formerly middleware).
 * Protects all dashboard routes — redirects unauthenticated users to /sign-in.
 * Uses NextResponse.redirect instead of auth.protect() to avoid Clerk routing
 * unauthenticated users to accounts.tryhabitflow.com (the Account Portal).
 */
export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
