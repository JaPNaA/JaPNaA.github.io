function ContentGetter(DT) {
    var D = {
        toGet: {}
    };
    DT.ContentGetter = D;

    class Request {
        constructor(url, preventCache) {
            this.url = url;
            this.preventCache = preventCache;

            this.requestObj = null;
            this.response = null;

            this.events = {
                load: []
            };

            this.request();
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
            x.send();

            this.requestObj = x;
        }
        cancel() {
            if (this.request) {
                this.requestObj.abort();
            }
        }

        load(e) {
            this.response = e;
            for (let i of this.events.load) {
                i(e);
            }
        }

        addEventListener(t, e) {
            this.events[t].push(e);
        }
    }

    D.add = function (id, url, preventCache, loadHandler) {
        D.toGet[id] = new Request(url, preventCache);

        if (loadHandler) {
            D.toGet[id].addEventListener("load", loadHandler);
        }
    };
}