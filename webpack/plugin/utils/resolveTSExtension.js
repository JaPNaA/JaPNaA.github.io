/**
 * @param {string} path
 * @returns {string}
 */

function resolveTSExtension(path) {
    // ".ts" as defined in webpack.config.js
    if (path.endsWith(".ts")) {
        return path;
    } else {
        return path + ".ts";
    }
}

module.exports = resolveTSExtension;