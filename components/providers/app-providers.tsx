'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './convex-client-provider';
import { ThemeProvider } from './theme-provider';
import { SentryUserContext } from './sentry-user-context';
import { ServiceWorkerProvider } from './service-worker-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <SentryUserContext />
      <ServiceWorkerProvider />
      <ConvexClientProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
