// Evento de instalação do service worker
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// Evento de ativação do service worker
self.addEventListener('activate', function(event) {
  // Limpeza de caches antigos pode ser feita aqui
});

// Intercepta requisições e tenta servir do cache primeiro
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
}); 