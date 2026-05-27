'use client';

import { useSearchParams } from 'next/navigation';

export function AccountDeletedBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get('accountDeleted') !== 'true') return null;

  return (
    <div
      className="w-full max-w-sm rounded-lg px-4 py-3 text-sm text-center"
      style={{
        background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
        color: "var(--text-primary)",
      }}
      role="status"
    >
      Your account has been deleted.
    </div>
  );
}
