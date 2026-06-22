// ─── Observation Ready AI — Service Worker ────────────────────────────────────
const CACHE_NAME = "obs-ready-ai-v2";
const SYNC_TAG   = "obs-ready-sync";

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
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API routes — always go to network for AI suggestions
  if (event.request.url.includes("/api/")) return;

  // Cache-then-network for Next.js internals
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
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
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

// ── Background Sync: retry failed saves when back online ─────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncPendingData());
  }
});

async function syncPendingData() {
  try {
    // Notify all open tabs that we're back online and syncing
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) => {
      client.postMessage({ type: "SYNC_COMPLETE", tag: SYNC_TAG });
    });
  } catch (err) {
    console.error("[SW] Background sync failed:", err);
  }
}

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = {
    title: "Observation Ready AI",
    body: "You have a new update from Observation Ready AI.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    url: "/",
  };

  // Parse push payload if available
  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      data: { url: data.url },
      vibrate: [100, 50, 100],
      requireInteraction: false,
    })
  );
});

// ── Notification click: open or focus the app ─────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
