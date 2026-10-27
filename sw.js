/* Mantém o app funcionando sem internet e busca atualizações quando há conexão. */
var CACHE = "gabaritos-v2.1";
var BASE = ["./", "index.html", "app.js", "omr.js", "logo.js", "jspdf.min.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  var simulados = req.url.indexOf("/simulados/") >= 0;
  if (simulados) {
    // Simulados: sempre tenta a versão mais nova; sem internet, usa a guardada.
    e.respondWith(fetch(req).then(function (r) {
      var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(req.url.split("?")[0], copia); }); return r;
    }).catch(function () { return caches.match(req.url.split("?")[0]); }));
    return;
  }
  // App: abre na hora com a cópia guardada e atualiza em segundo plano.
  e.respondWith(caches.match(req).then(function (hit) {
    var rede = fetch(req).then(function (r) {
      if (r.ok) { var copia = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copia); }); }
      return r;
    }).catch(function () { return hit; });
    return hit || rede;
  }));
});
