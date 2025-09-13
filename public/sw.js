self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('kap-static-v3').then(cache => cache.addAll(['/','/galeri','/kepengurusan','/manifest.webmanifest']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => !['kap-static-v3'].includes(k)).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin && (url.pathname.startsWith('/_next/image') || url.pathname.match(/\.(png|jpg|jpeg|webp|avif)$/))) {
    e.respondWith(
      caches.open('kap-images-v3').then(async cache => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        const res = await fetch(e.request);
        cache.put(e.request, res.clone());
        return res;
      })
    );
  }
});
