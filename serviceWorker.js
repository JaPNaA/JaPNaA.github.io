"use strict";

function c_ServiceWorker(DT) {
    const D = {
        worker: null,
        checkedVersion: false
    };
    DT.ServiceWorker = D;

    function alertUpdateSuccessful() {
        const a = document.createElement("a"),
            textBefore = document.createTextNode("An update was found! To finalize the update, just "),
            textAfter = document.createTextNode("."),
            seeChangelog = document.createElement("a"),
            docFrag = document.createDocumentFragment();

        a.href = location.href;
        a.innerHTML = "reload";
        a.addEventListener("click", function(e) {
            e.preventDefault();
            location.reload(true); // force reload
        });

        seeChangelog.href = "/content/changelog.txt";
        seeChangelog.target = "_blank";
        seeChangelog.innerHTML = "See changes";
        seeChangelog.style.marginTop = "8px";
        seeChangelog.style.display = "block";

        docFrag.appendChild(textBefore);
        docFrag.appendChild(a);
        docFrag.appendChild(textAfter);
        docFrag.appendChild(seeChangelog);

        DT.Utils.prompta(docFrag, 0, null, false);
    }

    function alertUpdateUnsuccessful(x) {
        const text = document.createTextNode("An update was found!... but failed to update (maybe) :( Please send a bug report"),
            br = document.createElement("br"),
            debugData = document.createElement("pre"),
            docFrag = document.createDocumentFragment();

        debugData.innerHTML = JSON.stringify({ responseCode: x.status, response: x.response });

        docFrag.appendChild(text);
        docFrag.appendChild(br);
        docFrag.appendChild(debugData);

        DT.Utils.prompta(docFrag, 2, null, false);
    }

    D.updateSite = function() {
        // request worker to reload
        var x = new XMLHttpRequest();
        x.open("GET", "/reloadCache");
        x.responseType = "text";
        x.addEventListener("load", function () {
            if (x.response === "ok") {
                alertUpdateSuccessful();
            } else {
                alertUpdateUnsuccessful(x);
            }
            DT.CLI.log("Site updated");
        });
        x.send();
    };

    // serviceworker checks the version of the site, the serviceworker may have have it cached
    function checkVersion() {
        var current = null,
            latest = null;

        if (D.checkedVersion) return;
        D.checkedVersion = true;

        function _checkdone() { // callback for both requests to compare data
            var localstorageVersion = DT.ContentGetter.localStorage.version;

            if (current !== null && latest !== null) {
                console.log(current, localstorageVersion, latest);
                if (current === latest && (localstorageVersion === latest || localstorageVersion === undefined)) {
                    console.log("running latest");
                } else {
                    console.log("running old");
                    D.updateSite();
                }

                DT.ContentGetter.writeLocalStorage("version", latest);
            }

            // debug
            DT.CLI.data.version.current = current;
            DT.CLI.data.version.latest = latest;
            DT.CLI.data.version.localStorage = localstorageVersion;
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

    function initServiceWorker() {
        navigator.serviceWorker.register("serviceWorker.wkr.js", {
            updateViaCache: "all"
        })
            .then(function (worker) {
                D.worker = worker;
                checkVersion();
            })
            .catch(function (err) {
                console.warn("ServiceWorker registration failed: ", err);
            });
    }

    D.setup = function () {
        if ("serviceWorker" in window.navigator) {
            initServiceWorker();
        } else {
            console.log("Browser doesn't support service workers");
        }
    };

    return D;
}