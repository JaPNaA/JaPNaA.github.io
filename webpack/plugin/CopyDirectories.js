const path = require("path");
const fsPromise = require("./utils/fsPromise");
const Component = require("./Component");

/**
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef { { copyDirectories: { from: string, to: string} } } CopyDirectoriesOptions
 */

class CopyDirectories extends Component {
    /**
     * @param {CopyDirectoriesOptions} options
     */
    constructor(options) {
        super();
        this.from = options.copyDirectories.from;
        this.to = options.copyDirectories.to;
    }

    filesChanged() { }

    /**
     * @param {Webpack.Compiler} compiler 
     * @returns {Promise<void>}
     */
    async initalize(compiler) {
        const fromPath = path.join(compiler.context, this.from);
        const toPath = path.join(compiler.context, this.to);

        await this.copyDirectory(fromPath, toPath);
    }

    /**
     * @param {string} fromPath 
     * @param {string} toPath 
     */
    async copyDirectory(fromPath, toPath) {
        await fsPromise.mkdir(toPath);

        await fsPromise.readdir(fromPath).then(files => {
            const proms = [];
            for (const itemName of files) {
                const fromItemPath = path.join(fromPath, itemName);
                const toItemPath = path.join(toPath, itemName);

                proms.push(fsPromise.stat(fromItemPath).then(stats => {
                    if (stats.isDirectory()) {
                        return this.copyDirectory(fromItemPath, toItemPath);
                    } else {
                        return fsPromise.copyFile(fromItemPath, toItemPath);
                    }
                }));
            }

            return Promise.all(proms);
        });
    }
}

module.exports = CopyDirectories;