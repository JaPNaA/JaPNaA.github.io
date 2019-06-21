// @ts-nocheck

const pluginName = 'PrintOnBuild';
const path = require("path");
const fs = require("fs");

const PATH_TO_VIEWS = "src/elm/views";
const PATH_TO_WIDGETS = "src/elm/widgets";

/**
 * @typedef {import("webpack")} Webpack
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("webpack/lib/node/NodeWatchFileSystem")} Webpack.Node.NodeWatchFileSystem
 */

class GenerateViewAndWidgetList {
    constructor() {
        /**
         * A list of names of views
         * @type {string[]}
         */
        this.views = [];

        /**
         * A list of names of widgets
         * @type {string[]}
         */
        this.widgets = [];

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
        const pathToWidgetsLength = PATH_TO_WIDGETS.length;

        for (const [absolutePath, changedFileName] of changedFiles) {
            if (changedFileName.slice(0, pathToViewsLength) === PATH_TO_VIEWS) {
                this.updateListIfIsView(compilation, absolutePath);
            } else if (changedFileName.slice(0, pathToWidgetsLength) === PATH_TO_WIDGETS) {
                this.updateListIfIsWidget(compilation, absolutePath);
            }
        }
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    init(compiler) {
        if (this.initalized) { return; }
        const contextViewsPath = compiler.context + "/" + PATH_TO_VIEWS;
        const viewsDirectories = fs.readdirSync(contextViewsPath);

        for (const directory of viewsDirectories) {
            if (fs.existsSync(contextViewsPath + "/" + directory + "/" + directory + ".ts")) {
                this.views.push(directory);
            }
        }

        const contextWidgetsPath = compiler.context + "/" + PATH_TO_WIDGETS;
        const widgetDirectories = fs.readdirSync(contextWidgetsPath);

        for (const directory of widgetDirectories) {
            if (fs.existsSync(contextWidgetsPath + "/" + directory + "/" + directory + ".ts")) {
                this.widgets.push(directory);
            }
        }

        this.updateViewMap(compiler);
        this.updateWidgetMap(compiler);

        this.initalized = true;
    }

    /**
     * @param {Webpack.Compiler} compiler 
     * @param {string} viewPath 
     */
    updateListIfIsView(compiler, viewPath) {
        this.updateListIfIs(this.views, compiler, viewPath);
        this.updateViewMap(compiler);
    }

    /**
     * @param {Webpack.Compiler} compiler 
     * @param {string} widgetPath 
     */
    updateListIfIsWidget(compiler, widgetPath) {
        this.updateListIfIs(this.widgets, compiler, widgetPath);
        this.updateWidgetMap(compiler);
    }

    /**
     * @param {string[]} listOfIt
     * @param {Webpack.Compiler} compiler 
     * @param {string} pathToIt
     */
    updateListIfIs(listOfIt, compiler, pathToIt) {
        const name = this.getFilenameWithoutExtension(pathToIt);
        if (this.getDirName(pathToIt) !== name) { return; }

        console.log(name, "changed");

        if (listOfIt.includes(name)) {
            if (!fs.existsSync(pathToIt)) {
                listOfIt.splice(listOfIt.indexOf(name), 1);
            }
        } else {
            listOfIt.push(name);
        }
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
     * @param {Webpack.Compiler} compiler 
     */
    updateWidgetMap(compiler) {
        fs.writeFileSync(
            compiler.context + "/" + PATH_TO_WIDGETS + "/widgetList.ts",
            `export default ${JSON.stringify(this.widgets)};`
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

module.exports = GenerateViewAndWidgetList;