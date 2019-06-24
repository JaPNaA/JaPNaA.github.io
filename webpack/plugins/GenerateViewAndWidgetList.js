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
         * @type {(string | [string, string])[]}
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
        this._initViewList(compiler);
        this._initWidgetList(compiler);
        this._initalized = true;
    }

    /**
     * Initalizes viewList
     * @param {Webpack.Compiler} compiler 
     */
    _initViewList(compiler) {
        const contextViewsPath = compiler.context + "/" + PATH_TO_VIEWS;
        const viewsDirectories = fs.readdirSync(contextViewsPath);

        for (const directory of viewsDirectories) {
            if (fs.existsSync(this._getPathFor(contextViewsPath, directory))) {
                this._addView(contextViewsPath, directory);
            }
        }

        this._updateViewMap(compiler);
    }

    /**
     * Initalizes widgetList
     * @param {Webpack.Compiler} compiler 
     */
    _initWidgetList(compiler) {
        const contextWidgetsPath = compiler.context + "/" + PATH_TO_WIDGETS;
        const widgetDirectories = fs.readdirSync(contextWidgetsPath);

        for (const directory of widgetDirectories) {
            if (fs.existsSync(this._getPathFor(contextWidgetsPath, directory))) {
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
        const viewName = this._getDirName(viewPath);
        const viewIndex = this.views.findIndex((value) => {
            if (Array.isArray(value)) {
                return value[0] === viewName;
            } else {
                return value === viewName;
            }
        });

        if (viewIndex >= 0) {
            if (!fs.existsSync(viewPath)) {
                this.views.splice(viewIndex, 1);
            }
        } else {
            try {
                this._addView(compiler.context + "/" + PATH_TO_VIEWS, viewName);
            } catch (err) {
                // view doesn't exist, that's fine.
            }
        }

        this._updateViewMap(compiler);
    }

    /**
     * @param {Webpack.Compiler} compiler 
     * @param {string} widgetPath 
     */
    _updateListIfIsWidget(compiler, widgetPath) {
        const name = this._getFilenameWithoutExtension(widgetPath);
        if (this._getDirName(widgetPath) !== name) { return; }

        if (this.widgets.includes(name)) {
            if (!fs.existsSync(widgetPath)) {
                this.widgets.splice(this.widgets.indexOf(name), 1);
            }
        } else {
            this.widgets.push(name);
        }

        this._updateWidgetMap(compiler);
    }

    /**
     * Adds a view to the list
     * @param {string} context
     * @param {string} directory 
     */
    _addView(context, directory) {
        //public\s+static\s.*viewMatcher = (\/.*\/);
        const file = fs.readFileSync(this._getPathFor(context, directory)).toString();
        const match = file.match(/public\s+static\s.*viewMatcher = (\/.*\/);/);

        if (match) {
            this.views.push([directory, match[1]]);
        } else {
            this.views.push(directory);
        }
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    _updateViewMap(compiler) {
        fs.writeFileSync(
            compiler.context + "/" + PATH_TO_VIEWS + "/viewList.ts",
            `const viewList: (string | [string, RegExp])[] = ${this._stringifyViews()}; export default viewList;`
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
        // @ts-ignore
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

    /**
     * @param {string} context 
     * @param {string} directory 
     */
    _getPathFor(context, directory) {
        return context + "/" + directory + "/" + directory + ".ts";
    }

    /**
     * @returns {string}
     */
    _stringifyViews() {
        let str = [];
        for (const view of this.views) {
            if (Array.isArray(view)) {
                str.push('["' + view[0] + '",' + view[1] + ']');
            } else {
                str.push('\"' + view + '\"');
            }
        }
        return "[" + str.join(",") + "]";
    }
}

module.exports = GenerateViewAndWidgetList;