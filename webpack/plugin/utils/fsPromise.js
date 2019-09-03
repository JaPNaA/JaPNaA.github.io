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
     * @param {Buffer | string} data 
     * @returns {Promise<void>}
     */
    writeFile(path, data) {
        return new Promise(function (res, rej) {
            fs.writeFile(path, data, function (err) {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    },

    /**
     * @param {string} path 
     */
    mkdir(path) {
        return new Promise(function (res, rej) {
            fs.mkdir(path, function (err) {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    },

    /**
     * @param {string} from 
     * @param {string} to 
     * @returns {Promise<void>}
     */
    copyFile(from, to) {
        return new Promise(function (res, rej) {
            fs.copyFile(from, to, function (err) {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    },

    /**
     * @param {string} path 
     * @returns {Promise<void>}
     */
    unlink(path) {
        return new Promise(function (res, rej) {
            fs.unlink(path, function (err) {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        });
    },

    /**
     * @param {string} path 
     */
    rmdir(path) {
        return new Promise(function (res, rej) {
            fs.rmdir(path, function (err) {
                if (err) {
                    rej(err);
                } else {
                    res();
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
    },

    /**
     * @param {string} path 
     * @returns {Promise<fs.Stats>}
     */
    stat(path) {
        return new Promise(function (res, rej) {
            fs.stat(path, function (err, stats) {
                if (err) {
                    rej(err);
                } else {
                    res(stats);
                }
            });
        });
    }
};