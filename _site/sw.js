const version = '20230415144801';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/clothing/printed-cotton-blend-t-shirt-teenage-girl-mango-teen-malaysia.html","/clothing/poney.html","/clothing/lovebonito.html","/clothing/drmister.html","/clothing/test-clothing.html","/clothing/zip-knit-sweater-teenage-girl-mango-teen-malaysia.html","/clothing/zip-knit-sweater-teenage-girl-mango-teen-malaysia.html","/clothing/zip-knit-sweater-teenage-girl-mango-teen-malaysia.html","/clothing/printed-cotton-blend-t-shirt-teenage-girl-mango-teen-malaysia.html","/clothing/oversized-message-t-shirt-teenage-girl-mango-teen-malaysia.html","/categories.html","/deals/","/","/manifest.json","/offline.html","/assets/search.json","/search.html","/redirects.json","/sitemap.xml","/robots.txt","/deals/page2/","/deals/page3/","/deals/page4/","/deals/page5/","/deals/page6/","/deals/page7/","/feed.xml","/assets/logos/logo.svg", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
