const WidgetOrViewListGeneratorComponent = require("./WidgetOrViewListGeneratorComponent");

/**
 * @typedef { { widgetList: { pathToWidgets: string, outFileName: string } } } WidgetListOptions
 */

class WidgetListGenerator extends WidgetOrViewListGeneratorComponent {
    /**
     * @param {WidgetListOptions} options 
     */
    constructor(options) {
        super(options.widgetList.pathToWidgets, options.widgetList.outFileName);

        /**
         * A list of names of widgets
         * @type {string[]}
         */
        this.widgets = [];
    }

    /**
     * Generates a source code for widgetList
     * @protected
     * @override
     * @returns {string}
     */
    generateListString() {
        return `export default ${JSON.stringify(this.widgets)};`;
    }

    /**
     * Checks if the list has widget in list
     * @protected
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return this.widgets.includes(name);
    }

    /**
     * Adds a widget to the list
     * @protected
     * @override
     * @param {string} context
     * @param {string} directory
     */
    addItem(context, directory) {
        this.widgets.push(directory);
        this.changed = true;
    }

    /**
     * Updates an item in the list
     * @protected
     * @override
     * @param {string} context
     * @param {string} name
     */
    updateItem(context, name) {
        const index = this.widgets.indexOf(name);
        if (index < 0) {
            this.widgets.push(name);
            this.changed = true;
        }
    }

    /**
     * Removes an item in the list
     * @protected
     * @override
     * @param {string} name
     */
    removeItem(name) {
        const index = this.widgets.indexOf(name);
        if (index >= 0) {
            this.widgets.splice(index, 1);
            this.changed = true;
        }
    }
}

module.exports = WidgetListGenerator;