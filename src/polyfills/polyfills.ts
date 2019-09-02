export default async function applyPolyfills() {
    if (!location.origin) {
        // @ts-ignore
        location.origin = location.protocol + "//" + location.host;
    }

    if (!CanvasRenderingContext2D.prototype.resetTransform) {
        applyPolyfill(import("./CanvasRenderingContext2d.resetTransform"));
    }

    if (!window.URLSearchParams) {
        applyPolyfill(import("./URLSearchParams"));
    }

    if (!Array.prototype.find) {
        applyPolyfill(import("./Array.find"));
    }

    // @ts-ignore
    if (!window.CSS) {
        applyPolyfill(import("./CSS"));
    }

    if (!String.prototype.startsWith) {
        applyPolyfill(import("./String.startsWith"));
    }

    if (!String.prototype.endsWith) {
        applyPolyfill(import("./String.endsWith"));
    }

    if (!Element.prototype.scrollBy) {
        applyPolyfill(import("./Element.scrollBy"));
    }

    // @ts-ignore
    if (!window.Symbol) {
        await applyPolyfill(import("./Symbol"));
    } else if (!Symbol.asyncIterator) {
        await applyPolyfill(import("./Symbol.asyncIterator"));
    }

    // @ts-ignore
    if (!window.Map) {
        applyPolyfill(import("./Map"));
    } else if (!Map.prototype[Symbol.iterator]) {
        applyPolyfill(import("./Map.symbolIterator"));
    }

}

function applyPolyfill(module: Promise<{ default: Function }>): Promise<void> {
    return module.then(m => m.default());
}