"use strict";

function c_ContentGetter(DT) {
    var D = {
        toGet: {}, // every request

        // localStorage
        // -----------------------------------------------------------------------------
        localStorage: null,             // localstorage data
        localStorageKey: "JaPNaASDT",   // key for localstorage
        canUseLocalStorage: true,       // allow use of localstorage?
        changedLocalStorage: false,     // has the localstorage been changed since updated?
        localStorageTimeout: null       // setTimeout for localstorage
    };
    DT.ContentGetter = D;

    // network
    // -----------------------------------------------------------------------------

    /**
     * @class
     * @param {String} url url to make request to
     * @param {Boolean} preventCache add ?nocache=* to request url
     * @param {String} responseType type of response to expect
     */
    function Request(url, preventCache, responseType) {
        this.url = url;
        this.preventCache = preventCache;
        this.responseType = responseType || "text";
        this.alertError = false;

        this.requestJSON = null;

        this.requestObj = null;

        this.events = {
            load: [],
            error: []
        };
        this.addedListeners = false;

        this.request();
    }

    Object.defineProperties(Request.prototype, {
        response: {
            get: function() {
                return this.requestJSON || this.requestObj.response;
            }
        },
        status: {
            get: function() {
                return this.requestObj.status;
            }
        },
        readyState: {
            get: function() {
                return this.requestObj.readyState;
            }
        }
    });

    Request.prototype.request = function () {
        var x = new XMLHttpRequest();
        if (this.preventCache) {
            x.open("GET", this.url +
                ("?nocache=" + Date.now() + Math.random())
            );
        } else {
            x.open("GET", this.url);
        }
        x.responseType = this.responseType;

        if (!this.addedListeners) {
            var that = this;
            x.addEventListener("load", function() {
                that.load(x.response);
            });

            x.addEventListener("error", function(e) {
                that.error(e);
            });

            this.addedListeners = true;
        }

        x.send();

        this.requestObj = x;
    };

    Request.prototype.cancel = function () {
        if (this.request) {
            this.requestObj.abort();
        }
    };

    Request.prototype.load = function (e) {
        var response = this.response || e;

        if (this.responseType === "json" && typeof response !== "object") {
            try {
                response = this.responseJSON = JSON.parse(response);
            } catch (e) {
                console.warn("Resource " + this.url + " is type " + this.responseType + " but failed to parse");
            }
        }

        this.dispatchEvent("load", response);
    };

    Request.prototype.error = function (e) {
        if (this.alertError) {
            DT.Utils.prompta("Failed to load resource: " + this.url, 2, null, false);
            console.error("Failed to load resource: " + this.url, e);
        } else {
            console.warn("Failed to load resource: " + this.url, e);
        }

        this.dispatchEvent("error", e);
    };

    Request.prototype.dispatchEvent = function (t, e) {
        var handlers = this.events[t],
            hl = handlers.length;

        for (var i = 0; i < hl; i++) {
            handlers[i](e);
        }
    };

    Request.prototype.addEventListener = function (t, e) {
        this.events[t].push(e);
    };

    // add content to get
    D.add = function (id, url, preventCache, loadHandler, responseType) {
        if (D.toGet[id]) { // if request exists
            var req = D.toGet[id];
            if (req.status === 200 || req.readyState === XMLHttpRequest.LOADING) { // if loaded and not caching is off
                if (loadHandler) {
                    loadHandler(D.toGet[id].response); // call loaded
                }
            } else {
                req.addEventListener("load", loadHandler);
                if (req.readyState !== XMLHttpRequest.OPENED) {
                    req.request();
                }
            }

            return D.toGet[id];
        } else {
            D.toGet[id] = new Request(url, preventCache, responseType);

            if (loadHandler) {
                D.toGet[id].addEventListener("load", loadHandler);
            }
        }

        return D.toGet[id];
    };

    // localstorage
    // -----------------------------------------------------------------------------
    function parseLocalStorage() {
        try {
            D.localStorage = JSON.parse(localStorage[D.localStorageKey]);
        } catch (e) {
            clearLocalStorage();
        }

        if (D.localStorage.fdtV) { // still using localstorage of old site, clear
            clearLocalStorage();
        }
    }

    function clearLocalStorage() {
        localStorage.removeItem(D.localStorageKey);
        D.localStorage = {};
        D.changedLocalStorage = true;
    }

    function stiLocalStorageUpdate() {
        clearTimeout(D.localStorageTimeout);
        D.localStorageTimeout = setTimeout(function () {
            D.updateLocalStorage();
        }, 100);
    }

    D.updateLocalStorage = function() {
        if (D.canUseLocalStorage) {
            localStorage[D.localStorageKey] = JSON.stringify(D.localStorage);
            D.changedLocalStorage = false;
        }
    };

    D.writeLocalStorage = function(key, value) {
        D.localStorage[key] = value;
        D.changedLocalStorage = true;
        
        // ensure no information loss
        stiLocalStorageUpdate();
    };

    D.setup = function() {
        parseLocalStorage();
        addEventListener("beforeunload", function() {
            D.updateLocalStorage();
        });
    };
    
    return D;
}