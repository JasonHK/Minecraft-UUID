var CACHE = "mc-uuid";

// On install, cache some resources.
self.addEventListener("install", function(evt) {
    console.log("The service worker is being installed.");

    // Ask the service worker to keep installing until the returning promise
    // resolves.
    evt.waitUntil(precache());
});

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener("fetch", function(event) {
    console.log("The service worker is serving the asset.");
    // You can use `respondWith()` to answer immediately, without waiting for the
    // network response to reach the service worker...
    event.respondWith(fromCache(event.request));
    // ...and `waitUntil()` to prevent the worker from being killed until the
    // cache is updated.
    event.waitUntil(update(event.request));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            "/",
            "/index.html",
            "/manifest.json",
            "/css/index.css",
            "/css/spinner.css",
            "/font/icons.eot",
            "/font/icons.svg",
            "/font/icons.ttf",
            "/font/icons.woff",
            "/font/icons.woff2",
            "/js/clipboard.js",
            "/js/index.js",
            "/js/mojang.js"
        ]);
    });
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
        return matching || Promise.reject("no-match");
        });
    });
}

// Update consists in opening the cache, performing a network request and
// storing the new response data.
function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
        return cache.put(request, response);
        });
    });
}