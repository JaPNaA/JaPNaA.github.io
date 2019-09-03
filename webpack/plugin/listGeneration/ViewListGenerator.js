const fsPromise = require("../utils/fsPromise");
const WidgetOrViewListGeneratorComponent = require("./WidgetOrViewListGeneratorComponent");

/**
 * @typedef { { viewList: { pathToViews: string, outFileName: string } } } ViewListOptions
 */

class ViewListGenerator extends WidgetOrViewListGeneratorComponent {
    /**
     * @param {ViewListOptions} options 
     */
    constructor(options) {
        super(options.viewList.pathToViews, options.viewList.outFileName);

        /**
         * A list of names of views
         * @type {(string | [string, string])[]}
         */
        this.views = [];
    }

    /**
     * Generates a source code for viewList
     * @protected
     * @override
     * @returns {string}
     */
    generateListString() {
        return `const viewList: (string | [string, RegExp])[] = ${this._stringifyViews()}; export default viewList;`;
    }

    /**
     * Adds a view to the list
     * @protected
     * @override
     * @param {string} context
     * @param {string} directory
     * @returns {Promise<void>}
     */
    async addItem(context, directory) {
        const file = await fsPromise.readFile(this._applyPathPattern(context, directory)).then(buffer => buffer.toString());
        const match = file.match(/public\s+static\s.*viewMatcher = (\/.*\/);/);

        if (match) {
            this.views.push([directory, match[1]]);
        } else {
            this.views.push(directory);
        }

        this.changed = true;
    }

    /**
     * Updates an item in the list
     * @protected
     * @param {string} context
     * @param {string} directory
     * @returns {Promise<void>}
     */
    async updateItem(context, directory) {
        /** @type {string} */
        let file;

        try {
            file = await fsPromise.readFile(this._applyPathPattern(context, directory)).then(buffer => buffer.toString());
        } catch (err) {
            this.removeItem(directory);
            return;
        }

        const match = file.match(/public\s+static\s.*viewMatcher = (\/.*\/);/);
        const index = this._indexOf(directory);

        if (match) {
            this.views[index] = [directory, match[1]];
        } else {
            this.views[index] = directory;
        }

        this.changed = true;
    }

    /**
     * Removes an item in the list
     * @protected
     * @override
     * @param {string} name
     */
    removeItem(name) {
        const index = this._indexOf(name);
        if (index >= 0) {
            this.views.splice(index, 1);
            this.changed = true;
        }
    }

    /**
     * Stringifies the list of views
     * @private
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

    /**
     * Gets the index of a view in `this.views`
     * @private
     * @param {string} name 
     * @returns {number}
     */
    _indexOf(name) {
        return this.views.findIndex(v => (Array.isArray(v) ? v[0] : v) === name);
    }
}

module.exports = ViewListGenerator;