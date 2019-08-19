// @ts-nocheck

/**
 * @typedef {import("webpack").loader.LoaderContext} LoaderContext
 */

/**
 * A macro
 * 
 * Example usage:
 * ```less
 * color: $$color;
 * ```
 * 
 * This becomes
 * 
 * ```less
 * color: @color; color: var(--color, @color);
 * ```
 * 
 * This allows modifying the varibles at run-time if the browser supports it, but 
 * still provides a valid field if it doesn't
 * 
 * @param {string} source
 * @this {LoaderContext}
 */
module.exports = function stylesheetVarMacro(source) {
    return source.replace(/([\w-]+)\s*:(.*)\$\$([\w-]+)(.*);/g, "$1:$2@$3$4; $1:$2var(--$3, @$3)$4;");
}