const path = require("path");
const fsPromise = require("../utils/fsPromise");

/**
 * @typedef {import("./RoutesList")} RoutesList
 * @typedef {import("./RoutesList").Route} Route
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * 
 * @typedef { { generateHTMLFiles: {
 *                  outDirectory: string,
 *                  templatePage: string,
 *                  baseReplacementMap: { [x: string]: string },
 *                  indexReplacementMap?: { [x: string]: string }
 *                  createIndexPage: boolean
 *             } } } GenerateHTMLFilesOptions
 */

const TEXT_REPLACEMENT_REGEX_G = /\${{([^]+?)}}/g;
const VIEW_METADATA_JSDOC_REGEX = /\/\*\*[^]+@viewmetadata([^]+?)\*\//;
const JSDOC_PROPERTY_REGEX_G = /@([^\s]+)\s(.+)/g;
const VIEW_MAYBE_INLINED_CONTENT_REGEX_G = /new\s+ViewMaybeInlinedContent\((\s*"(.+?)"|'(.+?')\s*)/g;

class GenerateViewHTML {
    /**
     * @param {RoutesList} routesList
     * @param {GenerateHTMLFilesOptions} options
     */
    constructor(routesList, options) {
        /** @type {RoutesList} */
        this.routesList = routesList;

        this.outDirectory = options.generateHTMLFiles.outDirectory;
        this.templatePage = options.generateHTMLFiles.templatePage;
        this.shouldCreateIndexPage = options.generateHTMLFiles.createIndexPage;
        this.baseReplacementMap = options.generateHTMLFiles.baseReplacementMap;
        this.indexReplacementMap = options.generateHTMLFiles.indexReplacementMap || {};

        /** @type {string} */
        this.pageTemplateSource = null;

        this.createdSet = new Set();
        this.createdIndexPage = false;

        routesList.onChange(this.routesChangeHandler.bind(this));
    }

    /**
     * @param {Webpack.Compiler} compiler
     */
    async routesChangeHandler(compiler) {
        /** @type {Promise<void>[]} */
        const proms = [];

        if (this.pageTemplateSource === null) {
            await fsPromise.readFile(path.join(compiler.context, this.templatePage))
                .then(buffer => this.pageTemplateSource = buffer.toString());
        }

        if (this.shouldCreateIndexPage && !this.createdIndexPage) {
            proms.push(this.createIndexPage(compiler.context));
        }

        for (const route of this.routesList.routes) {
            if (!this.createdSet.has(route)) {
                proms.push(this.createFileFor(compiler.context, route));
                this.createdSet.add(route);
            }
        }

        await Promise.all(proms);
    }

    /**
     * @param {string} context
     * @param {Route} route 
     * @returns {Promise<void>}
     */
    async createFileFor(context, route) {
        const file = await fsPromise.readFile(route.fileLocation);
        const fileStr = file.toString();

        /** @type {Object.<string, string>} */
        const replacementMap = {
            "title": "." + route.name.toLowerCase().replace(/\/|\\/g, '.'),
            "maybeInlinedContent": await this.getInlinedContent(context, route.fileLocation, fileStr),
            ...this.getViewMetadataJSDoc(fileStr)
        };

        if (replacementMap.tags) { replacementMap.tags = "," + replacementMap.tags; }

        await this._writeFileWithReplacementMap(replacementMap, context, route.name);
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
     * @param {string} fileStr
     * @param {string} sourceFilePath
     * @param {string} context
     * @returns {Promise<string>}
     */
    async getInlinedContent(context, sourceFilePath, fileStr) {
        /** @type {Promise[]} */
        const proms = [];
        const inlines = [];

        for (let match; match = VIEW_MAYBE_INLINED_CONTENT_REGEX_G.exec(fileStr);) {
            const inlineContentPath = match[2] || match[3];
            if (!inlineContentPath) { throw new Error("No inline content path"); }

            let inlineContentFilePath = inlineContentPath;

            if (inlineContentPath[0] === '/') {
                inlineContentFilePath = path.join("public", inlineContentFilePath);
            } else {
                inlineContentFilePath = path.resolve(sourceFilePath, inlineContentFilePath);
            }

            proms.push(fsPromise.readFile(path.join(context, inlineContentFilePath))
                .then(buf => {
                    const str = buf.toString();
                    inlines.push(
                        "<pre class=\"hiddenInlinedContent\" id=\"viewMaybeInlinedContent:" +
                        Buffer.from(inlineContentPath).toString("base64") +
                        "\">" + this._escapeForXML(str) + "</pre>"
                    );
                })
            );
        }

        await Promise.all(proms);

        return inlines.join("");
    }

    /**
     * @param {string} context 
     */
    async createIndexPage(context) {
        this.createdIndexPage = true;

        await this._writeFileWithReplacementMap(this.indexReplacementMap, context, "index")
    }

    /**
     * @param { { [x:string]: string } } replacementMap 
     * @param {string} context 
     * @param {string} filename 
     * @returns {Promise<void>}
     */
    async _writeFileWithReplacementMap(replacementMap, context, filename) {
        const outFilename = path.join(context, this.outDirectory, filename.toLowerCase() + ".html");
        const outDirname = path.dirname(outFilename);

        if (!await fsPromise.exists(outDirname)) {
            await fsPromise.mkdir(outDirname, { recursive: true });
        }

        await fsPromise.writeFile(
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

    /**
     * @param {string} str
     */
    _escapeForXML(str) {
        return (str.replace(/&/g, "&amp;")
            .replace(/'/g, "&apos;")
            .replace(/"/g, "&quot;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
        );
    }
}

module.exports = GenerateViewHTML;