// ─── Observation Ready AI — Service Worker ────────────────────────────────────
const CACHE_NAME = "obs-ready-ai-v1";

// Assets to cache on install (app shell)
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ── Install: pre-cache the app shell ─────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first, fall back to cache, then offline page ───────────────
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and cross-origin requests
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API routes — always go network for AI suggestions
  if (event.request.url.includes("/api/")) return;

  // Skip Next.js internal routes
  if (event.request.url.includes("/_next/")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Network-first strategy for pages
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Try cache, then offline page
        caches.match(event.request).then(
          (cached) =>
            cached ||
            caches.match("/offline") ||
            new Response("You are offline. Please check your connection.", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
        )
      )
  );
});
