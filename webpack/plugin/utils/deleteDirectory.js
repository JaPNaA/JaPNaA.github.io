const path = require("path");
const fsPromise = require("./fsPromise");

/**
 * @param {string} dirPath
 * @returns {Promise<void>}
 */
module.exports = async function deleteDirectory(dirPath) {
    await fsPromise.readdir(dirPath).then(files => {
        const proms = [];
        for (const itemName of files) {
            const itemPath = path.join(dirPath, itemName);
            proms.push(fsPromise.stat(itemPath).then(stats => {
                if (stats.isDirectory()) {
                    return deleteDirectory(itemPath);
                } else {
                    return fsPromise.unlink(itemPath);
                }
            }));
        }

        return Promise.all(proms);
    });

    await fsPromise.rmdir(dirPath);
};