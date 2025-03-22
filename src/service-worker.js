self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker...');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker...');
    return self.clients.claim();
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          return caches.open('dynamic').then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      }).catch((error) => {
        console.log('[Service Worker] Error fetching & caching new data', error);
      })
    );
  });
  