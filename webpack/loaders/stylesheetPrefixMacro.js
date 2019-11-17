// @ts-nocheck

/**
 * @typedef {import("webpack").loader.LoaderContext} LoaderContext
 */

/**
 * A macro
 * 
 * Example usage (note: the first line MUST be // #\[prefix]):
 * ```less
 * // #[prefix] .className
 * h1 { color: red; }
 * ```
 * 
 * This becomes
 * 
 * ```less
 * .className {
 * h1 { color: red; }
 * }
 * ```
 * 
 * This removes the need for every line to be indented
 * 
 * @param {string} source
 * @this {LoaderContext}
 */
module.exports = function stylesheetVarMacro(source) {
    const prefixFlagRegex = /^\s*\/\/\s*#\[prefix\]\s(.+)/;

    const prefixFlagMatch = source.match(prefixFlagRegex);
    if (!prefixFlagMatch) { return source; }
    let prefix = prefixFlagMatch[1];

    return prefix + " {" + source + "}";
}