'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

const DISMISSED_KEY = 'habitflow-pwa-dismissed';

export function InstallPrompt() {
  const { state, promptInstall } = usePWAInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state !== 'ready') return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 0);
    return () => clearTimeout(timer);
  }, [state]);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  }

  async function handleInstall() {
    await promptInstall();
    setVisible(false);
  }

  // lg:hidden keeps this off desktop without a JS media query (avoids layout shift)
  if (!visible) return null;

  return (
    <div
      role="banner"
      className="lg:hidden flex items-center gap-3 px-4 py-3"
      style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* App icon */}
      <Image
        src="/logo.svg"
        alt=""
        width={36}
        height={36}
        className="shrink-0 rounded-lg"
        aria-hidden="true"
      />

      {/* Copy */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
          Add to Home Screen
        </p>
        <p className="text-xs leading-tight mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Works offline &amp; feels like a native app
        </p>
      </div>

      {/* Install button */}
      <button
        type="button"
        onClick={handleInstall}
        className="shrink-0 px-3 py-1.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Install
      </button>

      {/* Dismiss */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        className="shrink-0 p-1 rounded-md transition-colors"
        style={{ color: 'var(--text-disabled)' }}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
