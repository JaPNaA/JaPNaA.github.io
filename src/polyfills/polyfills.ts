export default async function applyPolyfills() {
    if (!CanvasRenderingContext2D.prototype.resetTransform) {
        applyPolyfill(import("./CanvasRenderingContext2d.resetTransform"));
    }

    if (!window.URLSearchParams) {
        applyPolyfill(import("./URLSearchParams"));
    }

    // @ts-ignore
    if (!window.Symbol) {
        await applyPolyfill(import("./Symbol"));
    } else if (!Symbol.asyncIterator) {
        await applyPolyfill(import("./Symbol.asyncIterator"));
    }

    if (!Map.prototype[Symbol.iterator]) {
        applyPolyfill(import("./Map.symbolIterator"));
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
}

function applyPolyfill(module: Promise<{ default: Function }>): Promise<void> {
    return module.then(m => m.default());
}