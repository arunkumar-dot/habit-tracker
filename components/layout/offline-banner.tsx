'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Initialise from current state (not just event-driven)
    const initTimer = setTimeout(() => setOffline(!navigator.onLine), 0);

    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium"
      style={{
        background: 'var(--warning)',
        color: '#fff',
      }}
    >
      <WifiOff size={14} aria-hidden="true" />
      You&apos;re offline — showing cached data
    </div>
  );
}
