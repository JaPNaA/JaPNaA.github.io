function ShortUrl(DT) {
    var D = {};
    DT.ShortUrl = D;

    function alertHashDoesntExist(e) {
        DT.Utils.prompta("Requested short URL hash <b>" + e + "</b> doesn't exist");
        clearHash();
    }

    function setLocation(e) {
        location.assign(e);
    }

    function clearHash() {
        history.replaceState(null, null, location.origin);
    }

    function redirectUrlHash() { //* Fix this function
        if (!location.hash) return;

        var newHref = null,
            args = {
                forget: false
            },
            hash = location.hash.replace(/^#/, ""),
            firshCharHash = hash[0],
            hashContent = hash.slice(1);

        clearHash();

        if (!hash) return;

        switch (firshCharHash) {
        case "#": // number on site
            try {
                var mlhi = parseInt(hashContent);
            } catch (e) {
                break;
            }
            var f = function () {
                var a = dt.content.data.find(function (e) {
                    return e.no === mlhi;
                });

                if (a) {
                    setLocation(a.content.link);
                } else {
                    alertHashDoesntExist(hash);
                }
            };
            if (!window.dt) {
                addEventListener("load", f);
                return;
            } else {
                f();
            }
            break;
        case "_":
            var y = hashContent.match(/^\d*/)[0],
                yn = parseInt(y) || 0,
                n = hashContent.slice(y.length);
            
            newHref = "Thingy_" + (yn + 2016) + "/" + n;
            break;

        default: // from redirects list
            var a = new XMLHttpRequest();
            a.responseType = "text";
            a.open("GET", "content/redirects.txt?d=" + new Date().getTime() + Math.random());

            a.addEventListener("load", function () {
                var r = a.response.split("\n"),
                    l = [],
                    rl = r.length,
                    re = null;

                for (var i = 0; i < rl; i++) {
                    var ri = r[i].split(/\s*,\s*/g);
                    if (ri[0] === hash) {
                        let ar = ri.slice(2);

                        if (ar.includes("forget")) {
                            args.forget = true;
                        }

                        re = ri[1];
                        break;
                    }
                }

                if (re) {
                    setLocation(re);
                    if (args.forget) {
                        clearHash();
                    }
                } else {
                    alertHashDoesntExist(hash);
                }
            });
            a.addEventListener("error", e => prompta(e));
            a.send();
            return;
        }

        if (newHref) {
            setLocation(newHref);
            if (args.forget) {
                clearHash();
            }
        } else {
            if (window.prompta) {
                alertHashDoesntExist(hash);
            } else {
                addEventListener("load", function () {
                    alertHashDoesntExist(hash);
                });
            }
        }
    }

    D.setup = function() {
        addEventListener("hashchange", redirectUrlHash);
        redirectUrlHash();
    };
}