'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from './convex-client-provider';
import { ThemeProvider } from './theme-provider';
import { SentryUserContext } from './sentry-user-context';
import { ServiceWorkerProvider } from './service-worker-provider';
import { CapacitorSplashHider } from '@/components/capacitor-splash-hider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <CapacitorSplashHider />
      <SentryUserContext />
      <ServiceWorkerProvider />
      <ConvexClientProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
