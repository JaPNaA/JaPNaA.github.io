function ServiceWorker(DT) {
    var D = {};
    DT.ServiceWorker = D;

    function initServiceWorker() {
        navigator.serviceWorker.register("serviceWorker.wkr.js")
            .catch(function (err) {
                console.warn('ServiceWorker registration failed: ', err);
            });
    }

    D.setup = function () {
        addEventListener("load", initServiceWorker);
    };
}