const fs = require("fs");

module.exports = {
    /**
     * @param {string} path 
     * @returns {Promise<string[]>}
     */
    readdir(path) {
        return new Promise(function (res, rej) {
            fs.readdir(path, function (err, files) {
                if (err) {
                    rej(err);
                } else {
                    res(files);
                }
            });
        });
    },

    /**
     * @param {string} path 
     * @param {Buffer | string} data 
     */
    writeFile(path, data) {
        return new Promise(function (res, rej) {
            fs.writeFile(path, data, function (err) {
                if (err) {
                    rej();
                } else {
                    res();
                }
            });
        });
    },

    /**
     * @param {string} path 
     * @returns {Promise<Buffer>}
     */
    readFile(path) {
        return new Promise(function (res, rej) {
            fs.readFile(path, function (err, data) {
                if (err) {
                    rej(err);
                } else {
                    res(data);
                }
            });
        });
    },

    /**
     * @param {string} path 
     * @returns {Promise<boolean>}
     */
    exists(path) {
        return new Promise(function (res, rej) {
            fs.access(path, fs.constants.F_OK, function (err) {
                if (err) { res(false); }
                else { res(true); }
            });
        });
    }
};