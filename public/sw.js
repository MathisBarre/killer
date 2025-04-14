const CACHE_NAME = "killer-party-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  // Handle navigation requests (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If offline, return the offline page
        return caches.match("/offline.html");
      })
    );
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to cache it and return it
        const clonedResponse = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache non-success responses
          if (response.status === 200) {
            cache.put(event.request, clonedResponse);
          }
        });

        return response;
      })
      .catch(() => {
        // If network fails, try to return from cache
        return caches.match(event.request).then((cachedResponse) => {
          return (
            cachedResponse ||
            (event.request.destination === "image"
              ? caches.match("/icons/icon-192x192.png")
              : Promise.resolve())
          );
        });
      })
  );
});
