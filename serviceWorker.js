function ServiceWorker(DT) {
    var D = {
        worker: null,
        checkedVersion: false
    };
    DT.ServiceWorker = D;

    function checkVersion() {
        var current = null,
            latest = null;

        if (D.checkedVersion) return;
        D.checkedVersion = true;

        function _checkdone() { // callback for both requests to compare data
            if (current !== null && latest !== null) {
                if (current === latest) {
                    console.log("running latest");
                } else {
                    console.log("running old");

                    { // request worker to reload
                        let x = new XMLHttpRequest();
                        x.open("POST", "/reloadCache");
                        x.addEventListener("load", function () {
                            if (x.response == "ok") {
                                DT.Utils.prompta("An update was found! To see the new version, just <a href=\"" + location.href + "\">reload</a>.", 0, null, false);
                            } else {
                                DT.Utils.prompta("An update was found!... but failed to update :( Please send a bug report. <br> " +
                                    JSON.stringify({ responseCode: x.responseCode, response: x.response })
                                , 2, null, false);
                            }
                        });
                        x.responseType = "text";
                        x.send();
                    }
                }
            }
        }

        DT.ContentGetter.add("versionCurrent", "version.txt", false, function (e) {
            current = e;
            _checkdone();
        }, "text");

        DT.ContentGetter.add("versionNew", "version.txt", true, function (e) {
            latest = e;
            _checkdone();
        }, "text");
    }

    function onregistered() {
        // D.worker.onupdatefound = function () {
        //     var main = document.createDocumentFragment(),
        //         a = document.createTextNode("An update was found! Just "),
        //         b = document.createElement("a"),
        //         c = document.createTextNode(" to update!");

        //     b.innerHTML = "reload";
        //     b.href = location.href;

        //     main.appendChild(a);
        //     main.appendChild(b);
        //     main.appendChild(c);

        //     DT.Utils.prompta(main, 0, null, false);
        // };
    }

    function initServiceWorker() {
        navigator.serviceWorker.register("serviceWorker.wkr.js", {
            updateViaCache: 'all'
        })
            .then(function (worker) {
                D.worker = worker;
                checkVersion();
            })
            .catch(function (err) {
                console.warn('ServiceWorker registration failed: ', err);
            });
    }

    D.setup = function () {
        if ("serviceWorker" in window.navigator) {
            addEventListener("load", initServiceWorker);
        } else {
            console.log("Browser doesn't support service workers");
        }
    };
}