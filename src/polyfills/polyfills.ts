export default async function applyPolyfills() {
    const promises: Promise<void>[] = [];

    if (!location.origin) {
        // @ts-ignore
        location.origin = location.protocol + "//" + location.host;
    }

    if (!CanvasRenderingContext2D.prototype.resetTransform) {
        applyPolyfill(promises, import("./CanvasRenderingContext2d.resetTransform"));
    }

    if (!window.URLSearchParams) {
        applyPolyfill(promises, import("./URLSearchParams"));
    }

    if (!Array.prototype.find) {
        applyPolyfill(promises, import("./Array.find"));
    }

    // @ts-ignore
    if (!window.CSS) {
        applyPolyfill(promises, import("./CSS"));
    }

    if (!String.prototype.startsWith) {
        applyPolyfill(promises, import("./String.startsWith"));
    }

    if (!String.prototype.endsWith) {
        applyPolyfill(promises, import("./String.endsWith"));
    }

    if (!Element.prototype.scrollBy) {
        applyPolyfill(promises, import("./Element.scrollBy"));
    }

    if (!('classList' in Element.prototype)) {
        applyPolyfill(promises, import("./Element.classList"));
    }

    if (!history.pushState) {
        applyPolyfill(promises, import("./History-states"));
    }

    if (!performance.now) {
        applyPolyfill(promises, import("./Performance.now"));
    }

    if (!window.requestAnimationFrame) {
        applyPolyfill(promises, import("./requestAnimationFrame"));
    }

    // @ts-ignore
    if (!window.Symbol) {
        await applyPolyfill(promises, import("./Symbol"));
    } else if (!Symbol.asyncIterator) {
        await applyPolyfill(promises, import("./Symbol.asyncIterator"));
    }

    // @ts-ignore
    if (!window.Map) {
        applyPolyfill(promises, import("./Map"));
    } else if (!Map.prototype[Symbol.iterator]) {
        applyPolyfill(promises, import("./Map.symbolIterator"));
    }

    await Promise.all(promises);
}

function applyPolyfill(promises: Promise<void>[], module: Promise<{ default: Function }>): Promise<void> {
    const promise = module.then(m => m.default());
    promises.push(promise);
    return promise;
}