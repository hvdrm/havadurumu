self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("havadurumu-v1").then((cache) =>
      cache.addAll([
        "index.html",
        "manifest.json",
        "icon-192.png",
        "icon-512.png"
        // varsa: "style.css", "app.js", vs.
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
