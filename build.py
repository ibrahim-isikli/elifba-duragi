#!/usr/bin/env python3
"""Builds the PWA (index.html + sw.js) from kaynak/elifba-duragi.html. Run: python3 build.py
The source is the page as published in the artifact viewer (fonts from Google Fonts);
the PWA uses the local copies in fonts/ instead, so it works offline."""
import hashlib, json, pathlib, re
here = pathlib.Path(__file__).parent
src = (here / 'kaynak' / 'elifba-duragi.html').read_text(encoding='utf8')
links = re.findall(r'<link rel="(?:preconnect|stylesheet)" href="https://fonts\.(?:googleapis|gstatic)\.com[^>]*>\n', src)
assert len(links) == 3, links
body = src
for l in links: body = body.replace(l, '')
body = body.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
title = re.search(r'<title>.*?</title>\n', body).group(0)
body = body.replace(title, '')
head = '''<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Çocuklar için Kur'an okumaya hazırlık: harfler, harekeler, Lamelif ve cezm. İnternetsiz çalışır.">
<meta name="theme-color" content="#0B7A77">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Elifba">
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="fonts/fonts.css">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>
'''
sw_reg = '''<script>
/* PWA: offline cache; a new version activates on the next launch */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded || !hadController) return; reloaded = true;
    try { typeof toast === 'function' && toast('Uygulama güncellendi.'); } catch (e) {}
  });
}
</script>
'''
index = head + title + '</head>\n<body>\n' + body + '\n' + sw_reg + '</body>\n</html>\n'
(here / 'index.html').write_text(index, encoding='utf8')
fonts = sorted('fonts/' + f.name for f in (here / 'fonts').iterdir() if f.suffix in ('.css', '.woff2'))
assets = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'] + fonts
h = hashlib.sha256()
for a in assets[1:]:
    h.update((here / a).read_bytes())
version = h.hexdigest()[:10]
sw = '''/* Elifba Durağı service worker. CACHE changes whenever any asset changes.
   Other apps on the same origin keep their own caches: only this app's names are cleaned up. */
const CACHE = 'elifba-duragi-%s';
const ASSETS = %s;
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
''' % (version, json.dumps(assets))
(here / 'sw.js').write_text(sw, encoding='utf8')
print('built', version, len(index) // 1024, 'KB')
