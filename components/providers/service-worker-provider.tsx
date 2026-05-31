'use client';

import { useEffect } from 'react';

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        )
        .catch((err) => console.warn('[SW] Unregistration failed:', err));

      if ('caches' in window) {
        caches
          .keys()
          .then((keys) =>
            Promise.all(
              keys
                .filter((key) => key.startsWith('habitflow-'))
                .map((key) => caches.delete(key))
            )
          )
          .catch((err) => console.warn('[SW] Cache cleanup failed:', err));
      }

      return;
    }

    // Register the unified service worker (offline caching + FCM).
    // Generated at build time by scripts/generate-sw.mjs with Firebase config
    // baked in. Served as a static file from /public so it works with
    // Next.js static export (Capacitor). Scope '/' lets it control all pages.
    //
    // Only ONE SW is registered — usePushNotifications reuses this
    // registration (via navigator.serviceWorker.ready) instead of
    // registering a second SW at the same scope.
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js', { scope: '/' })
      .catch((err) => console.warn('[SW] Registration failed:', err));
  }, []);

  return null;
}
