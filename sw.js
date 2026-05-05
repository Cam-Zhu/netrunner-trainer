// ─── Runner's Toolkit Service Worker ─────────────────────────────────────────
// Cache-first for local static assets.
// Network-only for NRDB API, card image CDN, and analytics.
// Offline visits are supported for cached assets only.

const CACHE_NAME = 'runnerstoolkit-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/flashcards.js',
  '/challenge.js',
  '/mechanics.js',
  '/cardbrowser.js',
  '/learning.js',
  '/rules.js',
  '/skilltree.js',
  '/deckanalysis.js',
  '/card-data.js',
  '/card-images.js',
  '/card-sets.js',
  '/manifest.json',
];

// Network-only domains — never cache these
const NETWORK_ONLY = [
  'netrunnerdb.com',
  'card-images.netrunnerdb.com',
  'plausible.io',
  'upstash.io',
  'api.anthropic.com',
];

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Always go to network for external domains
  if (NETWORK_ONLY.some(d => url.hostname.includes(d))) return;

  // Cache-first for same-origin requests
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache valid same-origin GET responses
        if (
          response.ok &&
          event.request.method === 'GET' &&
          url.origin === self.location.origin
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
