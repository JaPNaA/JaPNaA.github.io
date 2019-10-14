const path = require("path");
const fsPromise = require("./utils/fsPromise");

/**
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("./listGeneration/ViewListGenerator")} ViewListGenerator
 * 
 * @typedef { { generateViewHTML: {
 *                  outDirectory: string,
 *                  templatePage: string,
 *                  baseReplacementMap: { [x: string]: string },
 *                  indexReplacementMap?: { [x: string]: string }
 *                  createIndexPage: boolean
 *             } } } GenerateViewHTMLOptions
 */

const TEXT_REPLACEMENT_REGEX_G = /\${{([^]+?)}}/g;
const VIEW_METADATA_JSDOC_REGEX = /\/\*\*[^]+@viewmetadata([^]+?)\*\//;
const JSDOC_PROPERTY_REGEX_G = /@([^\s]+)\s(.+)/g;

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
        this.indexReplacementMap = options.generateViewHTML.indexReplacementMap || {};

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
                proms.push(this.createFileFor(compiler.context, view.name));
                this.createdSet.add(view);
            }
        }

        await Promise.all(proms);
    }

    /**
     * @param {string} context
     * @param {string} viewName 
     * @returns {Promise<void>}
     */
    async createFileFor(context, viewName) {
        const file = await fsPromise.readFile(
            this.viewList.applyPathPattern(context, viewName)
        );

        /** @type {Object.<string, string>} */
        const replacementMap = {
            "title": "." + viewName,
            ...this.getViewMetadataJSDoc(file.toString())
        };

        if (replacementMap.tags) { replacementMap.tags = "," + replacementMap.tags; }

        await this._writeFileWithReplacementMap(replacementMap, context, viewName);
    }

    /**
     * @param {string} fileStr
     * @returns {Object.<string, string> | undefined}
     */
    getViewMetadataJSDoc(fileStr) {
        const match = fileStr.match(VIEW_METADATA_JSDOC_REGEX);
        if (!match) { return; }

        const metadataStr = match[1];
        /** @type {Object.<string, string>} */
        const obj = {};

        for (let match; match = JSDOC_PROPERTY_REGEX_G.exec(metadataStr);) {
            obj[match[1]] = match[2];
        }

        return obj;
    }

    /**
     * @param {string} context 
     */
    async createIndexPage(context) {
        this.createdIndexPage = true;

        this._writeFileWithReplacementMap(this.indexReplacementMap, context, "index")
    }

    /**
     * @param { { [x:string]: string } } replacementMap 
     * @param {string} context 
     * @param {string} filename 
     * @returns {Promise<void>}
     */
    _writeFileWithReplacementMap(replacementMap, context, filename) {
        return fsPromise.writeFile(
            path.join(context, this.outDirectory, filename.toLowerCase() + ".html"),
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

        while (match = TEXT_REPLACEMENT_REGEX_G.exec(templatePageSource)) {
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