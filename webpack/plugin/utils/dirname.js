const path = require("path");

module.exports = function dirname(dirPath) {
    const dirname = path.dirname(dirPath);
    return dirname.slice(dirname.lastIndexOf("/") + 1);
}