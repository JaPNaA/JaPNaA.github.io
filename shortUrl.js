function c_ShortUrl(DT) {
    var D = {};
    DT.ShortUrl = D;

    function alertHashDoesntExist(e) {
        {
            let prompt = document.createDocumentFragment(),
                bold = document.createElement("b");

            prompt.appendChild(document.createTextNode("Requested short URL hash: ")); // "Requested short URL hash: "
            bold.innerHTML = e; // `<b> ${e} </b>`
            prompt.appendChild(bold);
            prompt.appendChild(document.createTextNode(" doesn't exist.")); // " doesn't exist"
        
            DT.Utils.prompta(prompt, 1);
        }

        clearHash();
    }

    function setLocation(e) {
        location.assign(e);
    }

    function clearHash() {
        history.replaceState(null, null, location.origin);
    }

    function redirectUrlHash() {
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
            var hashInt = parseInt(hashContent),
                f = function (dt) {
                    var a = dt.find(function (e) {
                        return e.no === hashInt;
                    });

                    console.log(a);

                    if (a) {
                        setLocation(DT.Site.path + a.content.link);
                    } else {
                        alertHashDoesntExist(hash);
                    }
                };

            DT.ContentGetter.add("content", "content/0.json", true, function (e) {
                f(e.data);
            }, "json");
            break;
        case "_":
            var year = hashContent.match(/^\d*/)[0],
                yearInt = parseInt(year) || 0,
                path = hashContent.slice(year.length);

            if (!yearInt) break;

            newHref = DT.Site.path + "/Thingy_" + (yearInt + 2016) + "/" + path;
            break;

        default: // from redirects list
            DT.ContentGetter.add("redirects", "content/redirects.txt", true, function (e) {
                var lines = e.split("\n"),
                    list = [],
                    linesL = lines.length,
                    redirectLink = null;

                for (var i = 0; i < linesL; i++) { // int i in lines
                    var ri = lines[i].split(/\s*,\s*/g); // split by comma

                    // find hash
                    if (ri[0] === hash) {
                        redirectLink = ri[1];
                        break;
                    }
                }

                if (redirectLink) {
                    setLocation(redirectLink);
                } else {
                    alertHashDoesntExist(hash);
                }
            }, "text");
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

    D.setup = function () {
        addEventListener("hashchange", redirectUrlHash);
        redirectUrlHash();
    };
}