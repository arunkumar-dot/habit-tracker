import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
 * Uses auth.protect() so Clerk handles the post-sign-in handshake phase
 * correctly — the manual userId check was redirecting during handshake,
 * causing a sign-in loop. signInUrl is set on ClerkProvider + env vars so
 * auth.protect() redirects to /sign-in, not accounts.tryhabitflow.com.
 */
export const proxy = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
