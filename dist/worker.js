/* eslint-disable strict */
/* eslint-disable no-restricted-globals */

"use strict";

const CACHE = "mc-uuid";

function precache() {

    return caches.open(CACHE).then(cache => cache.addAll([
        "./",
        "./index.html",
        "./theme.css",
        "./main.js",
        "./favicon.ico",
        "./manifest.json",
        "./fonts/icons.eot",
        "./fonts/icons.svg",
        "./fonts/icons.ttf",
        "./fonts/icons.woff",
        "./fonts/icons.woff2",
        "./icon/icon_16x16.png",
        "./icon/icon_32x32.png",
        "./icon/icon_192x192.png",
        "./icon/icon_512x512.png",
        "./icon/safari.png",
        "./icon/safari-precomposed.png",
    ]));
}

function fromNetwork(request, timeout) {

    return new Promise((resolve, reject) => {
        const fetchTimeout = setTimeout(reject, timeout);

        fetch(request).then((response) => {
            clearTimeout(fetchTimeout);
            resolve(response);
        }, reject);
    });
}

function fromCache(request) {

    return caches.open(CACHE)
        .then(cache => cache.match(request)
            .then(result => result || Promise.reject(new Error("no-match"))));
}

function updateCache(request) {

    return caches.open(CACHE)
        .then(cache => fetch(request)
            .then(response => cache.put(request, response)));
}

self.addEventListener("install", (event) => {

    console.info("The service worker is being installed.");
    event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
    
    console.info("The service worker is serving the asset.");

    event.respondWith(fromNetwork(event.request, 1000)
        .then((response) => {
            event.waitUntil(updateCache(event.request));
            return response;
        }).catch(() => fromCache(event.request)));
});