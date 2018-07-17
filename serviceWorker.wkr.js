// version 0.3.1.3

// comment to debug
console.log = function () { }; // because I log too many things and I can't be bothered to remove them

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
    "/aboutPage.js",
    
    "/3rdParty/normalize.css",
    "/3rdParty/elasticlunr.min.js",

    "/img/searchIcon.png",
    "/close-button.svg"
]

var cachedVersionPath = "version.txt",
    newestVersion = null,
    cachedVersion = null,
    isCheckingVersion = false,
    hasCheckedVersion = false,
    hasCached = false; // used to prevent updating cache twice in a session

function createCaches() {
    if (hasCached) return;
    hasCached = true;

    console.log("creating/updating caches");

    caches.open(CACHE_NAME)
        .then(function (cache) {
            cache.add(cachedVersionPath);
            hasCheckedVersion = true;
        });

    return caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(cachePaths);
        });
}

function checkVersion() {
    fetch(cachedVersionPath) // request for newest version
        .then(function (req) {
            return req.text(); // return newest version text
        })
        .then(function (version) {
            newestVersion = version; // set to currentVersion
            return caches.match(cachedVersionPath); // request for the cached version
        })
        .then(function (req) {
            return req.text(); // cached version
        })
        .then(function (cVersion) {
            cachedVersion = cVersion; // set to cached version
        })
        .then(function () {
            if (newestVersion == cachedVersion) {
                hasCheckedVersion = true;
                console.log("current version: " + cachedVersion);
            } else {
                console.log("new version availble, current: " + cachedVersion + ", new: " + newestVersion);
                console.log("updating caches");

                createCaches();
            }
        });
}

addEventListener("install", function (e) {
    e.waitUntil(createCaches());
});

addEventListener("activate", function (e) {
    e.waitUntil(createCaches());
});

addEventListener("fetch", function (e) {
    if (!hasCheckedVersion && !isCheckingVersion) {
        isCheckingVersion = true;
        checkVersion();
    }

    if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
        return;
    }
    
    if (e.request.url.startsWith(location.origin + "/content/")) {
        // cache information from content
        let url = e.request.url,
            ixNoCache = url.lastIndexOf("?nocache="),
            cUrl = ixNoCache < 0 ? url : url.slice(0, ixNoCache); // if nocache exists, use removed, else, use normal

        e.respondWith(
            caches.match(cUrl)
                .then(function (r) {
                    if (r) {
                        console.log("return cache: " + cUrl);
                        return r;
                    } else {
                        console.log("return fetch: " + cUrl);
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
                        console.log("cache: " + cUrl);
                        cache.put(cUrl, responseToCache);
                    });

                return response;
            });
    }

    e.respondWith(
        caches.match(e.request)
            .then(function (r) {
                if (r) {
                    console.log("return cache: " + e.request.url)
                    return r;
                } else {
                    console.log("return fetch: " + e.request.url)
                    return fetch(e.request);
                }
            })
    );
});