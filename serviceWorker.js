function ServiceWorker(DT) {
    var D = {
        worker: null
    };
    DT.ServiceWorker = D;

    function checkVersion() {
        var current = null,
            latest = null;

        function _checkdone() { // callback for both requests to compare data
            if (current !== null && latest !== null) {
                if (current === latest) {
                    console.log("running latest");
                } else {
                    console.log("running old");

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
        navigator.serviceWorker.register("serviceWorker.wkr.js",{
            updateViaCache: 'all'
        })
            .then(function (worker) {
                D.worker = worker;
                onregistered();
            })
            .catch(function (err) {
                console.warn('ServiceWorker registration failed: ', err);
            });

        checkVersion();
    }

    D.setup = function () {
        addEventListener("load", initServiceWorker);
    };
}