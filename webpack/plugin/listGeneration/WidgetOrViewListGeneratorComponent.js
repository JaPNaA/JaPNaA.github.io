const path = require("path");
const fsPromise = require("../utils/fsPromise");
const Component = require("../Component");
const dirname = require("../utils/dirname");

/**
 * @typedef {import("webpack")} Webpack
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("webpack/lib/node/NodeWatchFileSystem")} Webpack.Node.NodeWatchFileSystem
 * 
 * @typedef {(compiler: Webpack.Compiler) => void | Promise<void>} ChangeHandler
 */

/**
 * List Generator Component
 * @abstract
 */
class WidgetOrViewListGeneratorComponent extends Component {
    /**
     * @param {string} pathToItems
     * @param {string} outFileName
     */
    constructor(pathToItems, outFileName) {
        super();

        /** @private */
        this._pathToItems = pathToItems;
        /** @private */
        this._outFileName = outFileName;

        /**
         * Has the list changed?
         * @type {boolean}
         */
        this.changed = false;

        /**
         * Previously generated string
         * @private
         * @type {string}
         */
        this._prevGenerated = "";

        /**
         * Event handlers when a change occurs
         * @private
         * @type {ChangeHandler[]}
         */
        this._changeEventHandlers = [];
    }


    /**
     * initalize component
     * @param {Webpack.Compiler} compiler
     */
    async initalize(compiler) {
        const contextPath = path.join(compiler.context, this._pathToItems);
        const directories = await fsPromise.readdir(contextPath);

        const proms = [];

        for (const directory of directories) {
            proms.push(fsPromise.exists(this._applyPathPattern(compiler.context, directory))
                .then(exists => {
                    if (exists) {
                        return this.addItem(compiler.context, directory);
                    }
                })
            );
        }

        await Promise.all(proms);
        await this._updateList(compiler);
    }

    /**
     * called when files change
     * @param {Webpack.Compiler} compiler
     * @param {[string, string][]} filesChanged
     */
    async filesChanged(compiler, filesChanged) {
        /** @type {Promise[]} */
        const proms = [];

        for (const [path] of filesChanged) {
            const name = dirname(path);
            proms.push(fsPromise.exists(this._applyPathPattern(compiler.context, name)).then(exists => {
                if (exists) {
                    if (this.has(name)) {
                        return this.updateItem(compiler.context, name);
                    } else {
                        return this.addItem(compiler.context, name);
                    }
                } else {
                    this.removeItem(name);
                }
            }));
        }

        await Promise.all(proms);

        if (this.changed) {
            await this._updateList(compiler);
            this.changed = false;
        }
    }

    /**
     * Adds an event handler to the change event
     * @param {ChangeHandler} handler
     */
    onChange(handler) {
        this._changeEventHandlers.push(handler);
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
     * @returns {void | Promise<void>}
     */
    addItem(context, name) { throw new Error("Abstract method call"); }

    /**
     * Updates an item in the list
     * @abstract
     * @protected
     * @param {string} context
     * @param {string} name
     * @returns {void | Promise<void>}
     */
    updateItem(context, name) { throw new Error("Abstract method call"); }

    /**
     * Removes an item in the list
     * @abstract
     * @protected
     * @param {string} name
     * @returns {void}
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
     * @returns {Promise<any> | void}
     */
    _updateList(compiler) {
        const listStr = this.generateListString();
        if (listStr !== this._prevGenerated) {
            this._prevGenerated = listStr;

            return Promise.all([
                fsPromise.writeFile(
                    path.join(compiler.context, this._pathToItems, this._outFileName),
                    listStr
                ),
                this._dispatchChange(compiler)
            ]);
        }
    }

    /**
     * @param {Webpack.Compiler} compiler
     * @returns {Promise<any[]>}
     */
    _dispatchChange(compiler) {
        /** @type {Promise[]} */
        const proms = [];

        for (const handle of this._changeEventHandlers) {
            const returnValue = handle(compiler);
            if (returnValue instanceof Promise) {
                proms.push(returnValue);
            }
        }

        return Promise.all(proms);
    }

    /**
     * applies that path pattern of widgets/views
     * @protected
     * @param {string} start 
     * @param {string} directory 
     */
    _applyPathPattern(start, directory) {
        return path.join(start, this._pathToItems, directory, directory + ".ts");
    }
}

module.exports = WidgetOrViewListGeneratorComponent;