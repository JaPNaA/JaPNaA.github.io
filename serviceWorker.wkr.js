// version 0.0.9

const CACHE_NAME = "JaPNaA-github-io_cache",
    CONTENT_CACHE_NAME = "JaPNaA-github-io_content-cache";

var cachePaths = [
    "/",
    "/404.html",
    "/contentGetter.js",
    "/fallback.js",
    "/index.css",
    "/index.html",
    "/index.js",
    "/menu.js",
    "/search.js",
    "/shortUrl.js",
    "/site.js",
    "/siteObjects.js",
    "splashScreen.js",
    "/utils.js",
    "/serviceWorker.js",
    
    "/normalize.css",
    "/elasticlunr.min.js",
    "/close-button.svg"
];

function createCaches() {
    return caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(cachePaths);
        });
}

addEventListener("install", function (e) {
    e.waitUntil(createCaches());
});

addEventListener("activate", function (e) {
    e.waitUntil(createCaches());
});

addEventListener("fetch", function (e) {
    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
        return;
    }

    if (e.request.url.startsWith(location.origin + "/content/")) {
        // cache information from content
        fetch(e.request)
            .then(function () {

            }, function () {

            });
        e.respondWith(
            caches.match(e.request)
                .then(function (r) {

                    if (r) {
                        return r;
                    } else {
                        return fetch(e.request);
                    }
                })
        );

        let request = e.request.clone();
        return fetch(request)
            .then(function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(CONTENT_CACHE_NAME)
                    .then(function (cache) {
                        cache.put(e.request, responseToCache);
                    });

                return response;
            }
            );
    }

    e.respondWith(
        caches.match(e.request)
            .then(function (r) {
                if (r) {
                    return r;
                } else {
                    return fetch(e.request);
                }
            })
    );
});