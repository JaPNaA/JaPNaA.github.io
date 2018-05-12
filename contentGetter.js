function ContentGetter(DT) {
    var D = {
        toGet: {}
    };
    DT.ContentGetter = D;

    class Request {
        constructor(url, preventCache) {
            this.url = url;
            this.preventCache = preventCache;
            this.alertError = false;

            this.requestObj = null;

            this.events = {
                load: []
            };

            this.request();
        }

        get response() {
            return this.requestObj.response;
        }
        get status() {
            return this.requestObj.status;
        }

        request() {
            var x = new XMLHttpRequest();
            if (this.preventCache) {
                x.open("GET", this.url +
                    ("?nocache=" + Date.now() + Math.random())
                );
            } else {
                x.open("GET", this.url);
            }
            x.responseType = "text";
            x.addEventListener("load", () => this.load(x.response));
            x.addEventListener("error", e => this.error(e));
            x.send();

            this.requestObj = x;
        }
        cancel() {
            if (this.request) {
                this.requestObj.abort();
            }
        }

        load(e) {
            for (let i of this.events.load) {
                i(e);
            }
        }
        error(e) {
            console.log("err");
            if (this.alertError) {
                DT.Utils.prompta("Failed to load resource: " + this.url);
                console.error("Failed to load resource: " + this.url, e);
            } else {
                console.warn("Failed to load resource: " + this.url, e);
            }
        }

        addEventListener(t, e) {
            this.events[t].push(e);
        }
    }

    D.add = function (id, url, preventCache, loadHandler) {
        if (D.toGet[id]) {
            let req = D.toGet[id];
            if (req.status === 200 && !preventCache) {
                if (loadHandler) {
                    loadHandler(D.toGet[id].response);
                }
            } else {
                req.request();
            }

            return D.toGet[id];
        } else {
            D.toGet[id] = new Request(url, preventCache);

            if (loadHandler) {
                D.toGet[id].addEventListener("load", loadHandler);
            }
        }

        return D.toGet[id];
    };
}