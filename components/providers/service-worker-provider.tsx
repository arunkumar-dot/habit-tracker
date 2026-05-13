'use client';

import { useEffect } from 'react';

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // Register the unified service worker served from the API route.
    // It is equivalent to /sw.js but served dynamically so Firebase config
    // can be injected at request time without hardcoding env vars in a
    // static file. The Service-Worker-Allowed: / header on the response
    // lets it control the root scope from an /api/* path.
    //
    // Only ONE SW is registered — usePushNotifications reuses this
    // registration (via navigator.serviceWorker.ready) instead of
    // registering a second SW at the same scope.
    navigator.serviceWorker
      .register('/api/firebase-messaging-sw', { scope: '/' })
      .catch((err) => console.warn('[SW] Registration failed:', err));
  }, []);

  return null;
}
