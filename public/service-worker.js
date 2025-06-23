
self.addEventListener('install', () => {
  console.log('✅ Service Worker instalado');
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
