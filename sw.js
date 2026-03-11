const CACHE = "ttl-calc-v2";
const ASSETS = [
  "./ttl-calculator.html",
  "./manifest.json",
  "./icon.svg"
];

// Install: cache the app shell
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener("fetch", e => {
  // Always go network-first for the Nominatim ZIP lookup
  if(e.request.url.includes("nominatim.openstreetmap.org")){
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
