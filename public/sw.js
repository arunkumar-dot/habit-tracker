// HabitFlow offline service worker
// Bump CACHE_VERSION to force cache invalidation on next deploy
const CACHE_VERSION = 'v1';
const STATIC_CACHE  = `habitflow-static-${CACHE_VERSION}`;
const IMAGE_CACHE   = `habitflow-images-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `habitflow-dynamic-${CACHE_VERSION}`;

// Pass these straight to the network — never intercept
const PASSTHROUGH = [
  // Convex real-time (HTTP + WebSocket)
  /convex\.cloud/,
  /convex\.site/,
  // Clerk auth
  /clerk\.accounts\.dev/,
  /clerk\.com/,
  /\/__clerk/,
  /\/api\/auth/,
  // Firebase push-notification SW endpoint
  /\/api\/firebase-messaging-sw/,
  // Sentry tunnel
  /\/monitoring/,
  // Next.js HMR WebSocket (dev only)
  /\/_next\/webpack-hmr/,
  // RSC payloads — always fresh
  /_rsc=/,
];

// Cache-first: versioned Next.js chunks + local static assets
const STATIC_PATTERNS = [
  /\/_next\/static\//,
  /\/icons\//,
  /\/manifest\.json/,
  /\.(woff2?|ttf|otf|eot)(\?.*)?$/,
];

// Cache-first: images
const IMAGE_PATTERNS = [
  /\.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$/,
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  // Take control immediately; don't wait for existing tabs to close
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // Precache the app shell so navigation works offline
      cache.add('/').catch(() => { /* ignore if offline at install time */ })
    )
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('habitflow-') && !k.endsWith(CACHE_VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET; let mutations/POSTs go straight to network
  if (request.method !== 'GET') return;

  // WebSocket upgrade — let the browser handle it
  if (request.headers.get('upgrade') === 'websocket') return;

  // Passthrough list — never cache these
  if (PASSTHROUGH.some((p) => p.test(request.url))) return;

  const { pathname } = new URL(request.url);

  // Versioned Next.js chunks and local static files — cache-first (safe: hash in filename)
  if (STATIC_PATTERNS.some((p) => p.test(pathname))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images — cache-first
  if (IMAGE_PATTERNS.some((p) => p.test(pathname))) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // HTML navigation — network-first so habits data is always fresh; fall back to
  // the cached shell so the app loads at all when offline
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Everything else — stale-while-revalidate (e.g. non-versioned JS/CSS)
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Truly offline and nothing cached — browser shows its own error
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Fall back to the app shell for any navigation miss
    const shell = await caches.match('/');
    return shell || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached); // if network fails, stale is fine

  return cached || fetchPromise;
}
