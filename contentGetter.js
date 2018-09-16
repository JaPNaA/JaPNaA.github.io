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
        localStorageTimeout: null,      // setTimeout for localstorage

        // site content
        // -----------------------------------------------------------------------------
        siteContent: null               // content to be loaded to the site
    };
    DT.ContentGetter = D;

    // Network Tracker
    // -----------------------------------------------------------------------------
    /**
     * @class
     */
    function NetworkTracker() {
        this.totalRequests = 0;
        this.loadedRequests = 0;

        this.events = {
            "load": []
        }; 

        this.loaded = false;
    }

    Object.defineProperties(NetworkTracker.prototype, {
        progress: {
            get: function() {
                return this.loadedRequests / this.totalRequests;
            }
        }
    });

    NetworkTracker.prototype.addEventListener = function(type, handler) {
        this.events[type].push(handler);
    };

    NetworkTracker.prototype.dispatchEvent = function(type) {
        for (var i = 0; i < this.events[type].length; i++) {
            this.events[type][i]();
        }
    };

    NetworkTracker.prototype.checkDone = function() {
        if (this.loadedRequests >= this.totalRequests) {
            this.loaded = true;
            this.dispatchEvent("load");
        }
    };

    NetworkTracker.prototype.newRequest = function() {
        this.totalRequests++;
    };
    
    NetworkTracker.prototype.cancelRequest = function() {
        this.totalRequests--;
    };

    NetworkTracker.prototype.loadedRequest = function() {
        this.loadedRequests++;
        this.checkDone();
    };

    D.networkTracker = new NetworkTracker();

    // Network
    // -----------------------------------------------------------------------------

    /**
     * @class
     * @param {String} id request id
     * @param {String} url url to make request to
     * @param {Boolean} preventCache add ?nocache=* to request url
     * @param {String} responseType type of response to expect
     */
    function Request(id, url, preventCache, responseType) {
        this.id = id;
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
            get: function () {
                return this.requestJSON || this.requestObj.response;
            }
        },
        status: {
            get: function () {
                return this.requestObj.status;
            }
        },
        readyState: {
            get: function () {
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
        // @ts-ignore
        x.responseType = this.responseType;

        if (!this.addedListeners) {
            x.addEventListener("load", function () {
                this.load(x.response);
            }.bind(this));

            x.addEventListener("error", function (e) {
                this.error(e);
            }.bind(this));

            this.addedListeners = true;
        }

        x.send();
        D.networkTracker.newRequest();

        this.requestObj = x;
    };

    Request.prototype.cancel = function () {
        if (this.request) {
            this.requestObj.abort();
            D.networkTracker.cancelRequest();
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
        D.networkTracker.loadedRequest();
    };

    Request.prototype.error = function (e) {
        if (this.alertError) {
            DT.Utils.prompta("Failed to load resource: " + this.url, 2, null, false);
            console.error("Failed to load resource: " + this.url, e);
        } else {
            console.warn("Failed to load resource: " + this.url, e);
        }

        this.dispatchEvent("error", e);
        D.networkTracker.loadedRequest();
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

    /**
     * Add content to get
     * @param {String} id id of item
     * @param {String} url url of item to get
     * @param {Boolean} preventCache prevent cache
     * @param {Function} loadHandler callback
     * @param {String} responseType responsetype
     * @returns {Request} request
     */
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
        } else {
            D.toGet[id] = new Request(id, url, preventCache, responseType);

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

    D.updateLocalStorage = function () {
        if (D.canUseLocalStorage) {
            localStorage[D.localStorageKey] = JSON.stringify(D.localStorage);
            D.changedLocalStorage = false;
        }
    };

    D.writeLocalStorage = function (key, value) {
        D.localStorage[key] = value;
        D.changedLocalStorage = true;

        // ensure no information loss
        stiLocalStorageUpdate();
    };

    D.setup = function () {
        parseLocalStorage();
        addEventListener("beforeunload", function () {
            D.updateLocalStorage();
        });
    };

    // load site content
    // -----------------------------------------------------------------------------
    /**
     * Loads site content
     * @class
     */
    function SiteContent() {
        this.path = "content/";

        /** @type {String} */
        this.pathFirst = null;
        /** @type {String} */
        this.pathLast = null;
        /** @type {String[]} */
        this.allPaths = null;

        /** @type {Object[]} */
        this.content = [];

        /** @type {Object} */
        this.first = null;
        /** @type {Object} */
        this.last = null;

        /** @type {Request} */
        this.firstReq = null;
        /** @type {Request} */
        this.lastReq = null;
        /** @type {Request} */
        this.indexReq = null;

        this.loadedIndex = false;

        this.events = {
            "index": [],
            "load": [],
            "error": []
        };

        this.setup();
    }

    SiteContent.prototype.addEventListener = function (type, handler) {
        this.events[type].push(handler);
    };

    SiteContent.prototype.dispatchEvent = function (type, data) {
        for (var i = 0; i < this.events[type].length; i++) {
            this.events[type][i](data);
        }
    };

    /**
     * callback when content is loaded
     * @param {Number} i content index
     * @param {Object} content content
     */
    SiteContent.prototype.onLoadContent = function (i, content) {
        this.content[i] = content;

        if (i === 0) {
            this.first = content;
        }
        if (i === this.allPaths.length - 1) {
            this.last = content;
        }
    };

    /**
     * Gets content based on index
     * @param {Number} index index of file
     * @returns {Request} request generated
     */
    SiteContent.prototype.getContent = function (index) {
        if (this.content[index]) return;

        var path = this.allPaths[index],
            req = D.add(
                "content." + path, this.path + path, false,
                this.onLoadContent.bind(this, index), "json"
            );

        if (index === 0) {
            this.firstReq = req;
        }
        if (index === this.allPaths.length - 1) {
            this.lastReq = req;
        }

        req.addEventListener("error", function () {
            this.dispatchEvent("error", req);
        }.bind(this));

        req.addEventListener("load", function () {
            this.dispatchEvent("load", req);
        }.bind(this));

        return req;
    };

    /**
     * Gets first and last file
     */
    SiteContent.prototype.getRequiredContent = function () {
        this.getContent(0);                        // load first
        this.getContent(this.allPaths.length - 1); // and last content
    };

    //* should be called at search
    /**
     * Gets all content from all indexed files
     * @returns {Request[]} list of requests made
     */
    SiteContent.prototype.getAllContent = function () {
        var reqlist = [];

        for (var i = 0; i < this.allPaths.length; i++) {
            var req = this.getContent(i);
            if (req) {
                reqlist.push(req);
            }
        }

        return reqlist;
    };

    /**
     * callback when index file is loaded
     * @param {Object} e index content
     */
    SiteContent.prototype.onLoadIndex = function (e) {
        this.pathFirst = e[0];
        this.pathLast = e[e.length - 1];
        this.allPaths = e;
        this.loadedIndex = true;

        // fill array with null (which is an object)
        for (var i = 0; i < this.allPaths.length; i++) {
            this.content[i] = null;
        }

        this.getRequiredContent();
        this.dispatchEvent("index");
    };

    SiteContent.prototype.setup = function () {
        this.indexReq = D.add("contentIndex", "content/index.json", true, this.onLoadIndex.bind(this), "json");
    };

    D.siteContent = new SiteContent();

    return D;
}