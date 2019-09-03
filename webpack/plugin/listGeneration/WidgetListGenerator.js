const fs = require("fs");
const WidgetOrViewListGeneratorComponent = require("./WidgetOrViewListGeneratorComponent");

const PATH_TO_WIDGETS = "src/elm/widgets";
const OUT_FILE_NAME = "widgetList.ts";

class WidgetListGenerator extends WidgetOrViewListGeneratorComponent {
    constructor() {
        super(PATH_TO_WIDGETS, OUT_FILE_NAME);

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
     * Adds a widget to the list
     * @protected
     * @override
     * @param {string} context
     * @param {string} directory
     */
    addItem(context, directory) {
        this.widgets.push(directory);
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
        }
    }

    /**
     * Removes an item in the list
     * @protected
     * @override
     * @param {string} name
     */
    removeItem(name) {
        this.widgets.splice(this.widgets.indexOf(name), 1);
    }
}

module.exports = WidgetListGenerator;