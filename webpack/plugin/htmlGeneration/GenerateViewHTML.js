const path = require("path");
const fsPromise = require("../utils/fsPromise");

/**
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("../listGeneration/ViewListGenerator")} ViewListGenerator
 * 
 * @typedef { { generateViewHTML: {
 *                  outDirectory: string,
 *                  templatePage: string,
 *                  baseReplacementMap: { [x: string]: string }
 *                  createIndexPage: boolean
 *             } } } GenerateViewHTMLOptions
 */

const TEXT_REPLACEMENT_REGEX = /\${{([^]+?)}}/g;

class GenerateViewHTML {
    /**
     * @param {ViewListGenerator} viewList
     * @param {GenerateViewHTMLOptions} options
     */
    constructor(viewList, options) {
        /** @type {ViewListGenerator} */
        this.viewList = viewList;

        this.outDirectory = options.generateViewHTML.outDirectory;
        this.templatePage = options.generateViewHTML.templatePage;
        this.shouldCreateIndexPage = options.generateViewHTML.createIndexPage;
        this.baseReplacementMap = options.generateViewHTML.baseReplacementMap;

        /** @type {string} */
        this.pageTemplateSource = null;

        this.createdSet = new Set();
        this.createdIndexPage = false;

        viewList.onChange(this.viewChangeHandler.bind(this));
    }

    /**
     * @param {Webpack.Compiler} compiler
     */
    async viewChangeHandler(compiler) {
        /** @type {Promise<void>[]} */
        const proms = [];

        if (this.pageTemplateSource === null) {
            await fsPromise.readFile(path.join(compiler.context, this.templatePage))
                .then(buffer => this.pageTemplateSource = buffer.toString());
        }

        if (this.shouldCreateIndexPage && !this.createdIndexPage) {
            proms.push(this.createIndexPage(compiler.context));
        }

        for (const view of this.viewList.views) {
            if (!this.createdSet.has(view)) {
                proms.push(this.createFileFor(compiler.context, view));
                this.createdSet.add(view);
            }
        }

        await Promise.all(proms);
    }

    /**
     * @param {string} context
     * @param {string | [string, string]} view 
     * @returns {Promise<void>}
     */
    async createFileFor(context, view) {
        const viewName = (Array.isArray(view) ? view[0] : view).toLowerCase();

        const replacementMap = {
            "title": "." + viewName,
            "description": "JaPNaA's website. (It's very nice)",
            "tags": ""
        };

        await fsPromise.writeFile(
            path.join(context, this.outDirectory, viewName + ".html"),
            this._generateFileString(replacementMap)
        );
    }

    /**
     * @param {string} context 
     */
    async createIndexPage(context) {
        this.createdIndexPage = true;

        this._writeFileWithReplacementMap({}, context, "index")
    }

    /**
     * @param { { [x:string]: string } } replacementMap 
     * @param {string} context 
     * @param {string} filename 
     * @returns {Promise<void>}
     */
    _writeFileWithReplacementMap(replacementMap, context, filename) {
        return fsPromise.writeFile(
            path.join(context, this.outDirectory, filename + ".html"),
            this._generateFileString({
                ...this.baseReplacementMap,
                ...replacementMap
            })
        );
    }

    /**
     * @param { {[x: string]: string} } replacementMap 
     * @returns {string}
     */
    _generateFileString(replacementMap) {
        const templatePageSource = this.pageTemplateSource;
        let writeStr = "";

        let match;
        let lastIndex = 0;

        while (match = TEXT_REPLACEMENT_REGEX.exec(templatePageSource)) {
            const replacementKey = match[1].trim();
            writeStr += templatePageSource.slice(lastIndex, match.index);
            writeStr += replacementMap[replacementKey] || "";
            lastIndex = match.index + match[0].length;
        }

        writeStr += templatePageSource.slice(lastIndex);

        return writeStr;
    }
}

module.exports = GenerateViewHTML;