// @ts-nocheck

/**
 * @typedef {import("webpack").loader.LoaderContext} LoaderContext
 */

const routeMacroMatcher = require("../regex/routeMacro").regexGlobal;

/**
 * @param {string} source
 * @this {LoaderContext}
 */
module.exports = function routeMacro(source) {
    let outStr = "";
    let lastIndex = 0;

    for (let match; match = routeMacroMatcher.exec(source);) {
        const path = match[2] || match[3];
        const name = path.slice(path.lastIndexOf('/') + 1);

        outStr += source.slice(lastIndex, match.index);
        outStr += '["' + name + '", () => import("' + path + '")]';

        lastIndex = match.index + match[0].length;
    }

    return outStr + source.slice(lastIndex);
}