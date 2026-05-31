'use client';

import { AppProviders } from './app-providers';

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
