// version 0.3.5

"use strict";

// comment to debug
// console.log = function () { }; // because I log too many things and I can't be bothered to remove them

var CACHE_NAME = "JaPNaA-github-io_cache",
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
    "/cli.js",

    "/cli/index.html",
    "/cli/index.js",
    "/cli/index.css",

    "/3rdParty/normalize.css",
    "/3rdParty/elasticlunr.min.js",

    "/img/searchIcon.png",
    "/close-button.svg"
];

var cachedVersionPath = "version.txt",
    newestVersion = null,
    cachedVersion = null,
    isCheckingVersion = false,
    hasCheckedVersion = false,
    hasCached = false; // used to prevent updating cache twice in a session

function createCaches(e) {
    if (hasCached) return;
    hasCached = true;

    console.log("creating/updating caches");

    var nocacheHeader = new Headers(),
        fetchInit = {
            method: "GET",
            headers: nocacheHeader
        };
    nocacheHeader.append("pragma", "no-cache");
    nocacheHeader.append("cache-control", "no-cache");


    let vercheck, cache;

    // remove previous caches
    let remcache = caches.keys().then(function (keys) {
        for (var key of keys) {
            caches.open(key).then(function (cache) {
                cache.keys().then(function (ckeys) {
                    for (var ckey of ckeys) {
                        cache.delete(ckey);
                    }
                });
            });
        }
    }).then(function() {
        vercheck = caches.open(CACHE_NAME)
            .then(function (cache) {
                fetch(cachedVersionPath, fetchInit).then(function (r) {
                    cache.put(cachedVersionPath, r);
                });
                hasCheckedVersion = true;
            });

        cache = caches.open(CACHE_NAME)
            .then(function (cache) {
                for (let cachePath of cachePaths) {
                    fetch(cachePath, fetchInit).then(function (r) {
                        cache.put(cachePath, r);
                    });
                }
                return;
            }); 

        if (e) {
            e.waitUntil(cache);
            e.waitUntil(vercheck);
        }
    });

    if (e) {
        e.waitUntil(remcache);
    }

    return remcache;
}

function checkVersion(e) {
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
            if (newestVersion === cachedVersion) {
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
    createCaches(e);
});

addEventListener("activate", function (e) {
    createCaches(e);
});

addEventListener("fetch", function (e) {
    if (!hasCheckedVersion && !isCheckingVersion) {
        isCheckingVersion = true;
        checkVersion(e);
    }

    if (e.request.cache === "only-if-cached" && e.request.mode !== "same-origin") {
        return;
    }
    
    if (e.request.url.startsWith(location.origin + "/content/")) {
        // cache information from content
        var url = e.request.url,
            ixNoCache = url.lastIndexOf("?nocache="),
            cUrl = ixNoCache < 0 ? url : url.slice(0, ixNoCache); // if nocache exists, use removed, else, use normal

        //e.respondWith(
        //    caches.match(cUrl)
        //        .then(function (r) {
        //            if (r) {
        //                console.log("return cache: " + cUrl);
        //                return r;
        //            } else {
        //                console.log("return fetch: " + cUrl);
        //                return fetch(e.request);
        //            }
        //        })
        //);

        e.respondWith(fetch(e.request)
            .then(function (response) {
                if (!response || response.status !== 200 || response.type !== "basic") {
                    return caches.match(cUrl)
                        .then(function (r) {
                            if (r) {
                                console.log("return cache: " + e.request.url);
                                return r;
                            } else {
                                return response;
                            }
                        });
                }

                var responseToCache = response.clone();

                caches.open(CONTENT_CACHE_NAME)
                    .then(function (cache) {
                        console.log("cache: " + cUrl);
                        cache.put(cUrl, responseToCache);
                    });

                return response;
            })
            .catch(function () {
                return caches.match(cUrl)
                    .then(function (r) {
                        console.log("return cache: " + e.request.url);
                        return r;
                    });
            }));
    } else if (e.request.url === location.origin + "/reloadCache") {
        hasCached = false;

        e.respondWith(
            new Response("ok", {
                headers: { "Content-Type": "text/plain" }
            })
        );

        createCaches(e)
            .then(function () {
                console.log("reloaded caches");
            });
        console.log("reloading caches");
    } else {
        e.respondWith(
            caches.match(e.request)
                .then(function (r) {
                    if (r) {
                        console.log("return cache: " + e.request.url);
                        return r;
                    } else {
                        console.log("return fetch: " + e.request.url);
                        return fetch(e.request);
                    }
                })
        );
    }
});