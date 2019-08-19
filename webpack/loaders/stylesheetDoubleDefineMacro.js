// @ts-nocheck

/**
 * @typedef {import("webpack").loader.LoaderContext} LoaderContext
 */

/**
 * A macro
 * 
 * Example usage (note: the first line MUST be // #\[double-define]):
 * ```less
 * // #[double-define] :root
 * @color: #000000;
 * ```
 * 
 * This becomes
 * 
 * ```less
 * @color: #000000;
 * 
 * :root {
 *   --color: #000000;
 * }
 * ```
 * 
 * This simplifies defining variables in .less files
 * 
 * @param {string} source
 * @this {LoaderContext}
 */
module.exports = function stylesheetVarMacro(source) {
    const doubleDefineFlagRegex = /^\s*\/\/\s*#\[double-define\]\s(.+)/;

    const doubleDefineFlagMatch = source.match(doubleDefineFlagRegex);
    if (!doubleDefineFlagMatch) { return source; }
    let root = doubleDefineFlagMatch[1];

    const lessVariableRegex = /@([\w-]+):(.+);/g;
    const defs = [];

    let variableMatches;
    while (variableMatches = lessVariableRegex.exec(source)) {
        defs.push([variableMatches[1], variableMatches[2]]);
    }

    const result = source + "\n" + root + " {\n" +
        defs.map(v => "--" + v[0] + ":" + v[1] + ";").join("\n") +
        "\n}";

    return result;
}