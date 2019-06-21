// @ts-nocheck

/**
 * @typedef {import("webpack").loader.LoaderContext} LoaderContext
 */

/**
 * @param {string} source
 * @this {LoaderContext}
 */
module.exports = function stripConsoleLogs(source) {
    // /** @type {LoaderContext} */
    // const _this = this;
    if (this._compiler.options.mode === "development") {
        return source;
    } else {
        return source.replace(/console\.log\(.*\);?/g, "");
    }
}