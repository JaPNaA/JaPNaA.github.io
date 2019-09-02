export default function loadPromisePolyfill(cb: Function): void {
    // @ts-ignore
    if (window.Promise) {
        cb();
        return;
    }

    const x = new XMLHttpRequest();
    x.open("GET", "bundles/promise-polyfill.js");
    x.responseType = "text";
    x.addEventListener("load", function () {
        // @ts-ignore
        window.Promise = 
            eval(x.response).default;
        cb();
    });
    x.send();
}