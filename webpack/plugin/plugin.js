const path = require("path");

const CopyDirectories = require("./CopyDirectories");
const GenerateHTMLFiles = require("./routes/GenerateHTMLFiles");
const RunScripts = require("./RunScript");
const SitemapGenerator = require("./sitemapGeneration/SitemapGenerator");
const RoutesList = require("./routes/RoutesList");

const pluginName = 'JaPNaA_github_io_Plugin';

/**
 * @typedef {import("webpack")} Webpack
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("webpack").Compilation} Webpack.Compilation
 * @typedef {import("webpack/lib/node/NodeWatchFileSystem")} Webpack.Node.NodeWatchFileSystem
 * @typedef {import("./Component")} Component
 */

class Plugin {
    /**
     * @param { RoutesList.RoutesListOptions &
     *          CopyDirectories.CopyDirectoriesOptions &
     *          GenerateHTMLFiles.GenerateHTMLFilesOptions &
     *          RunScripts.RunScriptsOptions &
     *          SitemapGenerator.SitemapGeneratorOptions } options 
     */
    constructor(options) {
        /**
         * Has the plugin has initalized?
         * @type {boolean}
         */
        this._initalized = false;


        // --- Components ---
        // todo: WidgetListGenerator, ViewListGenerator, SitemapGenerator, GenerateViewHTML
        this.routesList = new RoutesList(options);
        this.runScripts = new RunScripts(options);
        this.copyDirectories = new CopyDirectories(options);

        /**
         * @type {Component[]}
         */
        this.components = [
            this.routesList,
            this.runScripts,
            this.copyDirectories
        ];

        this.generateHTMLFiles = new GenerateHTMLFiles(this.routesList, options);

        this._startTime = Date.now();
        this._prevTimestamps = {};
    }

    /**
     * Webpack's initalization of the plugin
     * @param {Webpack.Compiler} compiler 
     */
    apply(compiler) {
        compiler.hooks.run.tapPromise(pluginName, compilation => this._init(compilation));
        compiler.hooks.afterEmit.tapPromise(pluginName, compilation => this._afterEmitHandler(compilation));
        compiler.hooks.watchRun.tapPromise(pluginName, compilation => this._watchRunHandler(compilation));
    }

    /**
     * Initalizes with the inital files
     * @param {Webpack.Compiler} compiler
     * @returns {Promise<void>}
     */
    async _init(compiler) {
        if (this._initalized) { return; }
        this._initalized = true;

        const proms = [];
        for (const component of this.components) {
            const returnValue = component.initalize(compiler);
            if (returnValue instanceof Promise) {
                proms.push(returnValue);
            }
        }

        await Promise.all(proms);
    }

    /**
     * Called after Webpack finishes compiling
     * @param {Webpack.Compilation} compilation
     * @returns {Promise<void>}
     */
    async _afterEmitHandler(compilation) {
        /** @type {Promise[]} */
        const proms = [];

        for (const component of this.components) {
            const returnValue = component.afterEmit(compilation);
            if (returnValue instanceof Promise) {
                proms.push(returnValue);
            }
        }

        await Promise.all(proms);
    }

    /**
     * Called when Webpack detects a file change
     * @param {Webpack.Compiler} compilation 
     */
    async _watchRunHandler(compilation) {
        this._init(compilation);

        const changedFiles = this._getChangedFiles(compilation);

        const proms = [];
        for (const component of this.components) {
            const returnValue = component.filesChanged(compilation, changedFiles);
            if (returnValue instanceof Promise) {
                proms.push(returnValue);
            }
        }

        await Promise.all(proms);
    }

    /**
     * @param {Webpack.Compiler} compiler
     * @returns {[string, string][]} [absolute, relative][]
     */
    _getChangedFiles(compiler) {
        /** @type {Webpack.Node.NodeWatchFileSystem} */
        // @ts-ignore
        const watchFileSystem = compiler.watchFileSystem;
        if (!watchFileSystem.watcher.mtimes) { return []; }
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

module.exports = Plugin;