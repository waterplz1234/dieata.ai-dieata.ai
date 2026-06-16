const CACHE_NAME = 'gaebu-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/', '/index.html', '/manifest.json'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Base44 앱 요청은 캐시 안 함 (항상 최신)
  if (e.request.url.includes('base44.app')) {
    return fetch(e.request);
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
