// This file configures the initialization of Sentry for edge features
// (middleware, edge routes). Note this is unrelated to the Vercel Edge Runtime
// and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: isProd ? 0.1 : 1.0,

  enableLogs: true,

  sendDefaultPii: false,

  beforeSend(event) {
    if (event.user) {
      const { id } = event.user;
      event.user = id ? { id } : undefined;
    }
    return event;
  },
});
