// Service Worker pour Akuma Budget PWA
// Version 2.2 - Optimisé pour Safari, Brave et compatibilité mobile

// Version automatique basée sur la date de build
const APP_VERSION = '2.2-' + Date.now();
const CACHE_NAME = `akuma-budget-${APP_VERSION}`;
const STATIC_CACHE_NAME = `akuma-budget-static-${APP_VERSION}`;

// Détection du navigateur pour optimisations spécifiques
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isBrave = navigator.brave && navigator.brave.isBrave;

// Ressources essentielles à mettre en cache
const ESSENTIAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon-32x32.png',
  '/apple-touch-icon.png'
];

// Resources statiques (CSS, JS, images)
const STATIC_RESOURCES = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('💾 Service Worker: Installation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources essentielles
      caches.open(CACHE_NAME).then(cache => {
        console.log('📦 Cache essentiel: chargement...');
        return cache.addAll(ESSENTIAL_RESOURCES);
      }),
      // Cache des ressources statiques
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('🎨 Cache statique: chargement...');
        return cache.addAll(STATIC_RESOURCES);
      })
    ]).then(() => {
      console.log('✅ Service Worker installé avec succès');
      // Force l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyage agressif de tous les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Forcer le rechargement - Compatible Safari/WebKit
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        return Promise.all(
          clients.map(client => {
            if (client.url.includes(self.location.origin)) {
              console.log('🔄 Force rechargement page:', client.url);
              // Safari iOS ne supporte pas client.navigate, utiliser postMessage
              if (client.navigate && typeof client.navigate === 'function') {
                return client.navigate(client.url);
              } else {
                // Fallback pour Safari: message vers la page
                client.postMessage({ 
                  type: 'SW_FORCE_RELOAD',
                  message: 'Service Worker updated - please reload'
                });
                return Promise.resolve();
              }
            }
          })
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker activé avec mise à jour forcée');
      // Prendre contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Stratégie pour les ressources de l'app
  if (url.origin === location.origin) {
    event.respondWith(handleAppRequest(request));
  }
  // Stratégie pour les API externes (Supabase)
  else if (url.hostname.includes('supabase.co')) {
    event.respondWith(handleAPIRequest(request));
  }
  // Autres requêtes : réseau uniquement
  else {
    event.respondWith(fetch(request));
  }
});

// Gestion des requêtes de l'app (Cache First avec Network Fallback)
async function handleAppRequest(request) {
  try {
    // 1. Chercher en cache d'abord
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Depuis cache:', request.url);
      return cachedResponse;
    }
    
    // 2. Essayer le réseau
    const networkResponse = await fetch(request);
    
    // 3. Mettre en cache si succès
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('🌐 Depuis réseau (mis en cache):', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('❌ Erreur réseau:', request.url);
    
    // 4. Fallback pour les pages HTML
    if (request.destination === 'document') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    
    // 5. Page d'erreur basique
    return new Response('Application hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Gestion des requêtes API (Network First avec Cache Fallback)
async function handleAPIRequest(request) {
  try {
    // 1. Essayer le réseau d'abord pour les données fraîches
    const networkResponse = await fetch(request);
    
    // 2. Mettre en cache seulement les GET réussies
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    console.log('🌐 API réseau:', request.url);
    return networkResponse;
    
  } catch (error) {
    // 3. Fallback cache si réseau indisponible
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        console.log('📦 API cache (hors ligne):', request.url);
        return cachedResponse;
      }
    }
    
    // 4. Erreur si pas de cache disponible
    console.log('❌ API indisponible:', request.url);
    throw error;
  }
}

// Messages du navigateur vers SW
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🔧 Service Worker Akuma Budget PWA chargé');