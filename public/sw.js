// ─── Observation Ready AI — Service Worker ────────────────────────────────────
const CACHE_NAME    = "obs-ready-ai-v3";
const SYNC_TAG      = "obs-ready-sync";
const PERIODIC_TAG  = "obs-ready-periodic-sync";

// Assets to pre-cache on install (app shell)
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ── Install ───────────────────────────────────────────────────────────────────
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
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: network-first, fall back to cache → offline page ──────────────────
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;
  if (event.request.url.includes("/api/")) return;

  if (event.request.url.includes("/_next/")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

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

// ── Background Sync: retry pending saves when connectivity returns ────────────
self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(runBackgroundSync());
  }
});

async function runBackgroundSync() {
  try {
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) =>
      client.postMessage({ type: "SYNC_COMPLETE", tag: SYNC_TAG })
    );
  } catch (err) {
    console.error("[SW] Background sync failed:", err);
  }
}

// ── Periodic Background Sync: refresh cached data once a day ─────────────────
self.addEventListener("periodicsync", (event) => {
  if (event.tag === PERIODIC_TAG) {
    event.waitUntil(runPeriodicSync());
  }
});

async function runPeriodicSync() {
  try {
    // Re-cache the app shell so the latest version is always available offline
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_ASSETS);

    // Notify open tabs that a fresh cache is ready
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) =>
      client.postMessage({ type: "PERIODIC_SYNC_COMPLETE" })
    );
    console.log("[SW] Periodic sync complete — app shell refreshed.");
  } catch (err) {
    console.error("[SW] Periodic sync failed:", err);
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

// ── Notification click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
