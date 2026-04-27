// This file configures the initialization of Sentry on the client (browser).
// The config added here is used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Lower sample rate in production to reduce volume; full trace in dev.
  tracesSampleRate: isProd ? 0.1 : 1.0,

  // Session replay: capture full sessions only on errors to limit PII exposure.
  // This app contains sensitive journal entries — mask everything by default.
  integrations: [
    Sentry.replayIntegration({
      // Mask all text and block all media — journal entries are sensitive.
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  // Never send email, name, or IP — we attach only the Clerk userId via
  // the SentryUserContext component in the root layout.
  sendDefaultPii: false,

  beforeSend(event) {
    // Strip any PII that may have been attached automatically; keep only id.
    if (event.user) {
      const { id } = event.user;
      event.user = id ? { id } : undefined;
    }
    return event;
  },

  // ── Noise suppression ──────────────────────────────────────────────────────
  ignoreErrors: [
    // Benign browser quirk — no actionable fix.
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Unhandled promise rejections that aren't real Error objects.
    "Non-Error promise rejection captured",
    // Network hiccups from flaky analytics / beacon endpoints.
    /Failed to fetch/i,
    /NetworkError/i,
    /Load failed/i,
    // Chrome extension noise.
    /chrome-extension:\/\//i,
    /extensions\//i,
  ],

  denyUrls: [
    // Block events from browser extensions.
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
    /^safari-web-extension:\/\//i,
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
