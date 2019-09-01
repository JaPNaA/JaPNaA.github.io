if (!CanvasRenderingContext2D.prototype.resetTransform) {
    import("./CanvasRenderingContext2d.resetTransform").then(m => m.default());
}

if (!Symbol.asyncIterator) {
    import("./Symbol.asyncIterator").then(m => m.default());
}