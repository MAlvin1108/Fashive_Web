const APP_SHELL_CACHE = "fashive-shell-v1";
const DYNAMIC_CACHE = "fashive-dynamic-v1";

const appShellFiles = [
  "/",
  "/index.html",
  "/bundle.js",
  "/favicon.ico",
  "/manifest.json",
  "/offline.html", 
  "/zipper(1).png",
  "/zipper.png",
];  

self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing App Shell");
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(appShellFiles);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating & Cleaning Old Caches");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (![APP_SHELL_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
            console.log("[ServiceWorker] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // proses permintaan untuk app shell (konten statis)
  if (appShellFiles.includes(requestUrl.pathname) || appShellFiles.includes(requestUrl.href.replace(self.location.origin, ""))) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
  // proses request ke API / konten dinamis
  else if (event.request.url.includes("/api")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        })
        .catch(() => {
          return new Response(JSON.stringify({ message: "Offline mode", data: [] }), {
            headers: { "Content-Type": "application/json" },
          });
        })
    );
  } 
  else {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request).catch(() => {
        // fallback untuk HTML
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("/offline.html");
        }
        // fallback untuk gambar (opsional)
        if (event.request.destination === "image") {
          return new Response("", { status: 404, statusText: "Image not available offline" });
        }

        return new Response("Resource unavailable", {
          status: 503,
          statusText: "Offline",
        });
      });
    })
  );
}
});

// Menangani push event
self.addEventListener("push", async function (event) {
  const data = event.data?.json() || {
    title: "Fashive Update!",
    body: "Ada cerita baru dari pengguna.",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.warn("Push message bukan JSON, fallback ke text()");
      data.body = await event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/zipper.png",
    badge: "/zipper.png",
    data: {
      url: "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title || "Notifikasi", options));
});


// Menangani klik notifikasi
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});


