const fsPromise = require("../utils/fsPromise");
const WidgetOrViewListGeneratorComponent = require("./WidgetOrViewListGeneratorComponent");

/**
 * @typedef { { viewList: { pathToViews: string, outFileName: string } } } ViewListOptions
 */

class View {
    /**
     * 
     * @param {string} name 
     * @param {boolean} isFullPage 
     * @param {string} [matcher]
     */
    constructor(name, isFullPage, matcher) {
        this.name = name;
        this.isFullPage = isFullPage;
        this.matcher = matcher;
    }

    /**
     * Returns the entry version used in viewList
     * @returns {string | [string, string]}
     */
    toListEntry() {
        if (this.matcher) {
            return [this.name, this.matcher];
        } else {
            return this.name;
        }
    }
}

class ViewListGenerator extends WidgetOrViewListGeneratorComponent {
    /**
     * @param {ViewListOptions} options 
     */
    constructor(options) {
        super(options.viewList.pathToViews, options.viewList.outFileName);

        /**
         * A list of names of views
         * @type {View[]}
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
     * Checks if the list has item in list
     * @abstract
     * @protected
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this._indexOf(name) >= 0;
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
        const view = await this._createViewObj(context, directory);
        this.views.push(view);
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
        /** @type {View} */
        let view;

        try {
            view = await this._createViewObj(context, directory);
        } catch (err) {
            this.removeItem(directory);
            console.warn("(Most likey deleted,) Removing view due to failed creation");
            return;
        }

        const index = this._indexOf(directory);
        if (index < 0) { throw new Error("Failed to find view to update"); }
        this.views[index] = view;

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
            const viewListEntry = view.toListEntry();

            if (Array.isArray(viewListEntry)) {
                str.push('["' + viewListEntry[0] + '",' + viewListEntry[1] + ']');
            } else {
                str.push('\"' + viewListEntry + '\"');
            }
        }
        return "[" + str.join(",") + "]";
    }

    /**
     * @private
     * @param {string} context 
     * @param {string} directory 
     * @returns {Promise<View>}
     */
    async _createViewObj(context, directory) {
        const file = await fsPromise.readFile(this.applyPathPattern(context, directory)).then(buffer => buffer.toString());
        const viewMatcherMatch = file.match(/static\s.*viewMatcher(:.*)?\s*=\s*(\/.*\/)\s*;/);
        const isFullPageMatch = file.match(/isFullPage(:.*)?\s*=\s*(true|false)\s*;/);

        let viewMatcher = null;
        if (viewMatcherMatch) {
            viewMatcher = viewMatcherMatch[2];
        }

        let isFullPage = false;
        if (isFullPageMatch) {
            isFullPage = isFullPageMatch[2] === "true";
        }

        return new View(directory, isFullPage, viewMatcher);
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