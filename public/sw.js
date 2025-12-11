// Service Worker for VibeMatch
// Handles offline functionality and caching

const CACHE_NAME = 'vibematch-v1';
const urlsToCache = [
  '/',
  '/login',
  '/discover',
  '/matches',
  '/messages',
  '/profile',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch((error) => {
          // Silently fail if cache fails
          console.log('Cache add failed:', error);
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Next.js internal routes
  if (event.request.url.includes('/_next/') || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('webpack-hmr')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch((error) => {
          // If network fails, return a basic response
          if (event.request.destination === 'document') {
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            });
          }
          throw error;
        });
      })
      .catch((error) => {
        // Silently handle errors
        console.log('Fetch failed:', error);
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

