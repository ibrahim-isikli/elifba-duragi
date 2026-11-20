/* Elifba Durağı service worker. CACHE changes whenever any asset changes.
   Other apps on the same origin keep their own caches: only this app's names are cleaned up. */
const CACHE = 'elifba-duragi-b5e77128e1';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "fonts/Baloo2-500-latin-ext.woff2", "fonts/Baloo2-500-latin.woff2", "fonts/Baloo2-700-latin-ext.woff2", "fonts/Baloo2-700-latin.woff2", "fonts/Baloo2-800-latin-ext.woff2", "fonts/Baloo2-800-latin.woff2", "fonts/Nunito-400-latin-ext.woff2", "fonts/Nunito-400-latin.woff2", "fonts/Nunito-600-latin-ext.woff2", "fonts/Nunito-600-latin.woff2", "fonts/Nunito-700-latin-ext.woff2", "fonts/Nunito-700-latin.woff2", "fonts/Nunito-800-latin-ext.woff2", "fonts/Nunito-800-latin.woff2", "fonts/ScheherazadeNew-400-arabic.woff2", "fonts/ScheherazadeNew-400-latin.woff2", "fonts/ScheherazadeNew-700-arabic.woff2", "fonts/ScheherazadeNew-700-latin.woff2", "fonts/fonts.css"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k.startsWith('elifba-duragi-')).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).catch(() =>
      req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
  );
});
