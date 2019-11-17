const resolveTSExtention = require("./resolveTSExtension");

const importRegex = require("../../regex/imports").regexGlobal;

/**
 * Gets the imports of a JavaScript file
 * @param {string} sourceStr 
 * @returns {Map<string, string>} Map<name, path>
 */
function getImports(sourceStr) {
    const map = new Map();

    for (let match; match = importRegex.exec(sourceStr);) {
        map.set(
            match[1],
            resolveTSExtention(match[3] || match[4])
        );
    }

    return map;
}


module.exports = getImports;