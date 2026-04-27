// This file configures the initialization of Sentry on the server (Node runtime).
// The config added here is used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: isProd ? 0.1 : 1.0,

  enableLogs: true,

  // Never send email, name, or IP — we attach only the Clerk userId.
  sendDefaultPii: false,

  beforeSend(event) {
    // Strip any PII that may have been attached automatically; keep only id.
    if (event.user) {
      const { id } = event.user;
      event.user = id ? { id } : undefined;
    }
    return event;
  },
});
