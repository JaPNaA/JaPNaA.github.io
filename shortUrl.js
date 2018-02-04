try {

function reqShortUrlNX(e) {
    prompta("Requested short URL hash <b>" + e + "</b> doesn't exist");
    location.hash = "";
}

function redirectUrlHash() {
    if (!location.hash) return;

    var re = null,
        args = {
            forget: false
        },
        lh = location.hash.replace(/^#/, ""),
        flh = lh[0],
        mlh = lh.slice(1);

    switch (flh) {
        case "#": // number on site
            try {
                var mlhi = parseInt(mlh);
            } catch (e) {
                break;
            }
            var f = function() {
                var a = dt.content.data.find(function (e) {
                    return e.no == mlhi;
                });

                if (a) {
                    location.replace(a.content.link);
                } else {
                    reqShortUrlNX(lh);
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
            var y = mlh.match(/^\d*/)[0],
                yn = parseInt(y) || 0,
                n = mlh.slice(y.length);
            debugger;
            re = "Thingy/" + (yn + 2016) + "/" + n;
            break;

        default: // from redirects list
            var a = new XMLHttpRequest();
            a.responseType = "text";
            a.open("GET", "redirects.txt?d=" + new Date().getTime() + Math.random());

            a.addEventListener("load", function () {
                var r = a.response.split("\n"),
                    l = [],
                    rl = r.length,
                    re = null;

                for (var i = 0; i < rl; i++) {
                    var ri = r[i].split(/\s*,\s*/g);
                    if (ri[0] == lh) {
                        let ar = ri.slice(2);

                        if(ar.includes("forget")) {
                            args.forget = true;
                        }

                        re = ri[1];
                        break;
                    }
                }

                if (re) {
                    location.replace(re);
                    if (args.forget) {
                        location.hash = "";
                    }
                } else {
                    reqShortUrlNX(lh);
                }
            });
            a.addEventListener("error", e => prompta(e));
            a.send();
            return;
            break;
    }

    if (re) {
        location.replace(re);
        if (args.forget) {
            location.hash = "";
        }
    } else {
        if (window.prompta) {
            reqShortUrlNX(lh);
        } else {
            addEventListener("load", function () {
                reqShortUrlNX(lh);
            });
        }
    }
}

addEventListener("hashchange", redirectUrlHash);
redirectUrlHash();

} catch (e) {
    console.error(e);
    try {
        prompta(e);
    } catch (e) {}
    dt.fallback.push(!1);
}