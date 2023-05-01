const version = '20230501065637';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/men/shoes/zara/zip-knit-sweater-teenage-girl-mango-teen-malaysia.html","/men/shoes/zara/zip-knit-sweater-teenage-girl-mango-teen-malaysia.html","/women/clothing/hermo/printed-cotton-blend-t-shirt-teenage-girl-mango-teen-malaysia.html","/women/clothing/hermo/oversized-message-t-shirt-teenage-girl-mango-teen-malaysia.html","/women/clothing/hermo/frayed-hem-denim-shorts-teenage-girl-mango-teen-malaysia.html","/categories/","/privacy/","/about/","/deals/","/index.html","/manifest.json","/offline.html","/assets/search.json","/search/","/css/style.css","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/men/accessories/index.html","/women/accessories/index.html","/men/adidas/index.html","/kids/adidas/index.html","/women/adidas/index.html","/men/asics/index.html","/women/asics/index.html","/kids/asics/index.html","/women/bags/index.html","/kids/bags/index.html","/men/bags/index.html","/women/bath-and-body-works/index.html","/men/bath-and-body-works/index.html","/women/beauty/index.html","/women/bokita-lover/index.html","/men/bokita-lover/index.html","/kids/boys-fashion/index.html","/women/calvin-klein/index.html","/men/calvin-klein/index.html","/kids/calvin-klein/index.html","/men/charles-keith/index.html","/kids/charles-keith/index.html","/women/charles-keith/index.html","/kids/clarks/index.html","/men/clarks/index.html","/women/clarks/index.html","/men/clothing/index.html","/women/clothing/index.html","/women/cottonon/index.html","/men/cottonon/index.html","/kids/cottonon/index.html","/men/forever21/index.html","/women/forever21/index.html","/kids/forever21/index.html","/kids/girls-fashion/index.html","/men/grooming/index.html","/men/hermo/index.html","/women/hermo/index.html","/kids/hermo/index.html","/blog/index.html","/women/index.html","/men/index.html","/kids/index.html","/men/jdsports/index.html","/kids/jdsports/index.html","/women/jdsports/index.html","/men/levis/index.html","/women/levis/index.html","/kids/levis/index.html","/women/mac-cosmetics/index.html","/men/mango/index.html","/women/mango/index.html","/kids/mango/index.html","/men/michael-kors/index.html","/kids/michael-kors/index.html","/women/michael-kors/index.html","/women/nars-cosmetics/index.html","/men/nike/index.html","/women/nike/index.html","/kids/nike/index.html","/kids/other/index.html","/women/padini/index.html","/kids/padini/index.html","/men/padini/index.html","/men/puma/index.html","/women/puma/index.html","/kids/puma/index.html","/men/sasa/index.html","/women/sasa/index.html","/men/sephora/index.html","/women/sephora/index.html","/men/shein/index.html","/women/shein/index.html","/kids/shein/index.html","/women/shins/index.html","/women/shoes/index.html","/men/shoes/index.html","/women/sports-direct/index.html","/men/sports-direct/index.html","/kids/sports-direct/index.html","/kids/surfdome/index.html","/men/surfdome/index.html","/women/surfdome/index.html","/kids/the-body-shop/index.html","/men/the-body-shop/index.html","/women/the-body-shop/index.html","/women/the-face-shop/index.html","/women/triump/index.html","/men/under-armour/index.html","/kids/under-armour/index.html","/women/under-armour/index.html","/kids/vans/index.html","/men/vans/index.html","/women/vans/index.html","/kids/zalora/index.html","/men/zalora/index.html","/women/zalora/index.html","/kids/zara/index.html","/women/zara/index.html","/men/zara/index.html","/feed.xml","/css/style.css.map","/assets/logos/logo.svg", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
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
