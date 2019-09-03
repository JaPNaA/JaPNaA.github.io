const path = require("path");
const fs = require("fs");
const Component = require("../Component");
const dirname = require("../utils/dirname");

/**
 * @typedef {import("webpack")} Webpack
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("webpack/lib/node/NodeWatchFileSystem")} Webpack.Node.NodeWatchFileSystem
 */

/**
 * List Generator Component
 * @abstract
 */
class WidgetOrViewListGeneratorComponent extends Component {
    /**
     * @param {string} pathToItems
     * @param {string} outPath
     */
    constructor(pathToItems, outPath) {
        super();

        /**
         * Previously generated string
         * @type {string}
         */
        this.prevGenerated = "";

        this.pathToItems = pathToItems;
        this.outFileName = outPath;
    }


    /**
     * initalize component
     * @param {Webpack.Compiler} compiler
     */
    initalize(compiler) {
        const contextPath = path.join(compiler.context, this.pathToItems);
        const directories = fs.readdirSync(contextPath);

        for (const directory of directories) {
            if (fs.existsSync(this._applyPathPattern(compiler.context, directory))) {
                // this.list.push(directory);
                this.addItem(compiler.context, directory);
            }
        }

        this._updateList(compiler);
    }

    /**
     * called when files change
     * @param {Webpack.Compiler} compiler
     * @param {[string, string][]} filesChanged
     */
    filesChanged(compiler, filesChanged) {
        const contextPath = path.join(compiler.context, this.pathToItems);
        for (const [path] of filesChanged) {
            const name = dirname(path);
            if (fs.existsSync(this._applyPathPattern(contextPath, name))) {
                if (this.has(name)) {
                    this.updateItem(contextPath, name);
                } else {
                    this.addItem(contextPath, name);
                }
            } else {
                this.removeItem(name);
            }
        }
    }

    /**
     * Generates the string to be written to the list
     * @abstract
     * @protected
     * @returns {string}
     */
    generateListString() { throw new Error("Abstract method call"); }

    /**
     * Adds the item to the list
     * @abstract
     * @protected
     * @param {string} context
     * @param {string} name
     */
    addItem(context, name) { throw new Error("Abstract method call"); }

    /**
     * Updates an item in the list
     * @abstract
     * @protected
     * @param {string} context
     * @param {string} name
     */
    updateItem(context, name) { throw new Error("Abstract method call"); }

    /**
     * Removes an item in the list
     * @abstract
     * @protected
     * @param {string} name
     */
    removeItem(name) { throw new Error("Abstract method call"); }

    /**
     * Checks if the list has item in list
     * @abstract
     * @protected
     * @param {string} name
     * @returns {boolean}
     */
    has(name) { throw new Error("Abstract method call"); }

    /**
     * updates the list
     * @param {Webpack.Compiler} compiler
     */
    _updateList(compiler) {
        const listStr = this.generateListString();
        if (listStr !== this.prevGenerated) {
            fs.writeFileSync(
                path.join(compiler.context, this.pathToItems, this.outFileName),
                listStr
            );
            this.prevGenerated = listStr;
        }
    }

    /**
     * applies that path pattern of widgets/views
     * @param {string} start 
     * @param {string} directory 
     */
    _applyPathPattern(start, directory) {
        return path.join(start, this.pathToItems, directory, directory + ".ts");
    }
}

module.exports = WidgetOrViewListGeneratorComponent;