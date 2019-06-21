// @ts-nocheck

const pluginName = 'PrintOnBuild';
const path = require("path");
const fs = require("fs");

const PATH_TO_VIEWS = "src/elm/views";

/**
 * @typedef {import("webpack")} Webpack
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("webpack/lib/node/NodeWatchFileSystem")} Webpack.Node.NodeWatchFileSystem
 */

class GenerateViewList {
    constructor() {
        /**
         * A list of names of views
         * @type {string[]}
         */
        this.views = [];

        /**
         * Has the plugin has initalized?
         * @type {boolean}
         */
        this.initalized = false;

        this.startTime = Date.now();
        this.prevTimestamps = {};
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, compilation => {
            this.init(compilation);
        });
        compiler.hooks.watchRun.tap(pluginName, compilation => this.onWatchRun(compilation));
    }

    /**
     * @param {Webpack.Compiler} compilation 
     */
    onWatchRun(compilation) {
        this.init(compilation);

        const changedFiles = this.getChangedFiles(compilation);
        const pathToViewsLength = PATH_TO_VIEWS.length;
        for (const [absolutePath, changedFileName] of changedFiles) {
            if (changedFileName.slice(0, pathToViewsLength) === PATH_TO_VIEWS) {
                this.updateIfIsView(compilation, absolutePath);
            }
        }
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    init(compiler) {
        if (this.initalized) { return; }
        const contextViewsPath = compiler.context + "/" + PATH_TO_VIEWS;
        const directories = fs.readdirSync(contextViewsPath);

        for (const directory of directories) {
            if (fs.existsSync(contextViewsPath + "/" + directory + "/" + directory + ".ts")) {
                this.views.push(directory);
            }
        }

        this.updateViewMap(compiler);

        this.initalized = true;
    }

    /**
     * @param {string} viewPath 
     */
    updateIfIsView(compiler, viewPath) {
        const viewName = this.getFilenameWithoutExtension(viewPath);
        if (this.getDirName(viewPath) !== viewName) { return; }

        console.log(viewName, "changed");

        if (this.views.includes(viewName)) {
            if (!fs.existsSync(viewPath)) {
                this.views.splice(this.views.indexOf(viewName), 1);
            }
        } else {
            this.views.push(viewName);
        }

        this.updateViewMap(compiler);
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    updateViewMap(compiler) {
        fs.writeFileSync(
            compiler.context + "/" + PATH_TO_VIEWS + "/viewList.ts",
            `export default ${JSON.stringify(this.views)};`
        );
    }

    /**
     * @param {string} filePath
     */
    getFilenameWithoutExtension(filePath) {
        const name = path.basename(filePath);
        return name.slice(0, name.lastIndexOf("."));
    }

    /**
     * @param {string} dirPath 
     */
    getDirName(dirPath) {
        const dirname = path.dirname(dirPath);
        return dirname.slice(dirname.lastIndexOf("/") + 1);
    }

    /**
     * @param {Webpack.Compiler} compiler
     * @returns {[string, string][]} [absolute, relative][]
     */
    getChangedFiles(compiler) {
        /** @type {Webpack.Node.NodeWatchFileSystem} */
        const watchFileSystem = compiler.watchFileSystem;
        return Object.keys(watchFileSystem.watcher.mtimes)
            .filter(watchfile =>
                this.prevTimestamps[watchfile] || this.startTime <
                compiler.fileTimestamps[watchfile] || Infinity
            )
            .map(changedFile => [
                changedFile,
                path.relative(compiler.context, changedFile)
            ]);
    }
}

module.exports = GenerateViewList;