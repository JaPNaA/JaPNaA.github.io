/**
 * @typedef {import("webpack")} Webpack
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("webpack").compilation.Compilation} Webpack.Compilation
 * @typedef {import("webpack/lib/node/NodeWatchFileSystem")} Webpack.Node.NodeWatchFileSystem
 */

/**
 * Webpack Component
 * @abstract
 */
class Component {
    /**
     * initalize component
     * @abstract
     * @param {Webpack.Compiler} compiler
     * @returns {void | Promise<void>}
     */
    initalize(compiler) { }

    /**
     * called when files change
     * @param {Webpack.Compiler} compiler 
     * @param {[string, string][]} filesChanged [absolute, relative]
     * @returns {void | Promise<void>}
     */
    filesChanged(compiler, filesChanged) { }

    /**
     * called when emitted
     * @param {Webpack.Compilation} compilation
     * @returns {void | Promise<void>}
     */
    afterEmit(compilation) { }
}

module.exports = Component;