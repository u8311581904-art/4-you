// Cambia el nombre de la caché (por ejemplo, de v1 a v2 o v3)
const CACHE_NAME = '4you-cache-v2';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './foto1.jpg',
  './foto2.jpg'
];

// Evento Install: fuerza a tomar los nuevos archivos
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Obliga al Service Worker nuevo a activarse de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento Activate: borra automáticamente las cachés viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Evento Fetch: sirve los archivos guardados
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
