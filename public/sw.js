/**
 * SignSpeak AI service worker — hand-written, no build magic.
 *
 * Two jobs:
 *  1. Cache the MediaPipe WASM runtime (self-hosted under /wasm/, copied
 *     from node_modules at install time) and the hand-landmarker model
 *     (Google CDN) with a cache-first strategy so the gesture pipeline
 *     works offline after the first visit.
 *  2. Best-effort app-shell caching for navigations while offline.
 *
 * No analytics, no push, no background sync — the worker never exfiltrates.
 */
const APP_CACHE = "signspeak-app-v2";
const MODEL_CACHE = "signspeak-models-v2";
const APP_SHELL = ["/", "/dashboard", "/privacy", "/manifest.webmanifest"];

const MODEL_ORIGINS = new Set(["https://cdn.jsdelivr.net", "https://storage.googleapis.com"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(APP_SHELL).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== APP_CACHE && k !== MODEL_CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);

  // Self-hosted MediaPipe WASM + models: cache-first (immutable per version).
  const isModelOrigin = MODEL_ORIGINS.has(url.origin);
  const isLocalWasm = url.origin === self.location.origin && url.pathname.startsWith("/wasm/");
  const isLocalModel = url.origin === self.location.origin && url.pathname.startsWith("/models/");
  if (isModelOrigin || isLocalWasm || isLocalModel) {
    event.respondWith(
      caches.open(MODEL_CACHE).then((cache) =>
        cache.match(event.request).then(
          (hit) =>
            hit ??
            fetch(event.request).then((res) => {
              if (res.ok) cache.put(event.request, res.clone());
              return res;
            }),
        ),
      ),
    );
    return;
  }

  // Navigations: network-first, fall back to cache when offline.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches
            .open(APP_CACHE)
            .then((cache) => cache.put(event.request, copy))
            .catch(() => {});
          return res;
        })
        .catch(() => caches.match(event.request).then((hit) => hit ?? caches.match("/dashboard"))),
    );
  }
});
