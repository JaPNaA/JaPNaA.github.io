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
        this._initalized = false;

        this._startTime = Date.now();
        this._prevTimestamps = {};
    }

    /**
     * Webpack's initalization of the plugin
     * @param {Webpack.Compiler} compiler 
     */
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, compilation => {
            this._init(compilation);
        });
        compiler.hooks.watchRun.tap(pluginName, compilation => this._watchRunHandler(compilation));
    }

    /**
     * @param {Webpack.Compiler} compilation 
     */
    _watchRunHandler(compilation) {
        this._init(compilation);

        const changedFiles = this._getChangedFiles(compilation);

        for (const [absolutePath, changedFileName] of changedFiles) {
            if (changedFileName.startsWith(PATH_TO_VIEWS)) {
                this._updateListIfIsView(compilation, absolutePath);
            } else if (changedFileName.startsWith(PATH_TO_WIDGETS)) {
                this._updateListIfIsWidget(compilation, absolutePath);
            }
        }
    }

    /**
     * Initalizes with the inital files
     * @param {Webpack.Compiler} compiler 
     */
    _init(compiler) {
        if (this._initalized) { return; }
        this._initViewList();
        this._initWidgetList();
        this._initalized = true;
    }

    _initViewList() {
        const contextViewsPath = compiler.context + "/" + PATH_TO_VIEWS;
        const viewsDirectories = fs.readdirSync(contextViewsPath);

        for (const directory of viewsDirectories) {
            if (fs.existsSync(contextViewsPath + "/" + directory + "/" + directory + ".ts")) {
                this.views.push(directory);
            }
        }

        this._updateViewMap(compiler);
    }

    _initWidgetList() {
        const contextWidgetsPath = compiler.context + "/" + PATH_TO_WIDGETS;
        const widgetDirectories = fs.readdirSync(contextWidgetsPath);

        for (const directory of widgetDirectories) {
            if (fs.existsSync(contextWidgetsPath + "/" + directory + "/" + directory + ".ts")) {
                this.widgets.push(directory);
            }
        }

        this._updateWidgetMap(compiler);
    }

    /**
     * @param {Webpack.Compiler} compiler 
     * @param {string} viewPath 
     */
    _updateListIfIsView(compiler, viewPath) {
        this._updateListIfIs(this.views, viewPath);
        this._updateViewMap(compiler);
    }

    /**
     * @param {Webpack.Compiler} compiler 
     * @param {string} widgetPath 
     */
    _updateListIfIsWidget(compiler, widgetPath) {
        this._updateListIfIs(this.widgets, widgetPath);
        this._updateWidgetMap(compiler);
    }

    /**
     * Updates a list if the path to a view or widget is valid
     * @param {string[]} listOfIt
     * @param {string} pathToIt
     */
    _updateListIfIs(listOfIt, pathToIt) {
        const name = this._getFilenameWithoutExtension(pathToIt);
        if (this._getDirName(pathToIt) !== name) { return; }

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
    _updateViewMap(compiler) {
        fs.writeFileSync(
            compiler.context + "/" + PATH_TO_VIEWS + "/viewList.ts",
            `export default ${JSON.stringify(this.views)};`
        );
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    _updateWidgetMap(compiler) {
        fs.writeFileSync(
            compiler.context + "/" + PATH_TO_WIDGETS + "/widgetList.ts",
            `export default ${JSON.stringify(this.widgets)};`
        );
    }

    /**
     * @param {string} filePath
     */
    _getFilenameWithoutExtension(filePath) {
        const name = path.basename(filePath);
        return name.slice(0, name.lastIndexOf("."));
    }

    /**
     * @param {string} dirPath 
     */
    _getDirName(dirPath) {
        const dirname = path.dirname(dirPath);
        return dirname.slice(dirname.lastIndexOf("/") + 1);
    }

    /**
     * @param {Webpack.Compiler} compiler
     * @returns {[string, string][]} [absolute, relative][]
     */
    _getChangedFiles(compiler) {
        /** @type {Webpack.Node.NodeWatchFileSystem} */
        const watchFileSystem = compiler.watchFileSystem;
        return Object.keys(watchFileSystem.watcher.mtimes)
            .filter(watchfile =>
                this._prevTimestamps[watchfile] || this._startTime <
                compiler.fileTimestamps[watchfile] || Infinity
            )
            .map(changedFile => [
                changedFile,
                path.relative(compiler.context, changedFile)
            ]);
    }
}

module.exports = GenerateViewAndWidgetList;