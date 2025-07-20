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
const CACHE = "hava-v1";
const OFFLINE_URL = "/index.html";

self.addEventListener("install", ev=>{
  ev.waitUntil(caches.open(CACHE)
    .then(cache=>cache.addAll([OFFLINE_URL])));
  self.skipWaiting();
});

self.addEventListener("activate", ev=>{
  ev.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", ev=>{
  if(ev.request.mode==="navigate"){
    ev.respondWith(
      fetch(ev.request).catch(()=>caches.match(OFFLINE_URL))
    );
  } else {
    ev.respondWith(
      caches.match(ev.request).then(resp=>resp||fetch(ev.request))
    );
  }
});
