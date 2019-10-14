/**
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 * @typedef {import("./SitemapEntry").SitemapEntry} SitemapEntry
 * @typedef {import("../listGeneration/ViewListGenerator")} ViewListGenerator
 * 
 * @typedef {[number, string, string][]} ThingyIndexJSON
 * @typedef {[string, string][]} YearThingyIndex
 * 
 * @typedef { { generateSitemap: SitemapGeneratorOptionsInner } } SitemapGeneratorOptions
 */

/**
 * @typedef SitemapGeneratorOptionsInner
 * @property {string} outPath
 * @property {string} siteUrl
 * @property {string} thingyPath
 */

const url = require("url");
const path = require("path");
const fsPromise = require("../utils/fsPromise");
const Component = require("../Component");

class SitemapGenerator extends Component {
    /**
     * @param {ViewListGenerator} viewList 
     * @param {SitemapGeneratorOptions} options
     */
    constructor(viewList, options) {
        super();

        this.viewList = viewList;
        this.outPath = options.generateSitemap.outPath;
        this.thingyPath = options.generateSitemap.thingyPath;
        this.siteUrl = options.generateSitemap.siteUrl;

        /** @type {SitemapEntry[]} */
        this.entries = [];

        this.viewListAdded = false;
        this.thingiesAdded = false;

        viewList.onInitDone(this.onViewListInitDoneHandler.bind(this));
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    async onViewListInitDoneHandler(compiler) {
        for (const view of this.viewList.views) {
            if (!view.isFullPage) { continue; }
            this.entries.push({
                url: url.resolve(this.siteUrl, view.name.toLowerCase()),
                priority: 0.8
            });
        }

        this.viewListAdded = true;
        this._writeOutIfShould(compiler.context);
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    async initalize(compiler) {
        this._addThingies(compiler.context);
        this._writeOutIfShould(compiler.context);
    }

    /**
     * @param {string} context 
     */
    async _addThingies(context) {
        const resolvedThingyPath = path.resolve(context, this.thingyPath);

        /** @type {ThingyIndexJSON} */
        const thingyIndex = this._bufferToJSON(await fsPromise.readFile(
            path.join(resolvedThingyPath, "Thingy", "index.json")
        ));

        /** @type {Promise<void>[]} */
        const proms = [];

        this.entries.push({
            url: url.resolve(this.siteUrl, "Thingy/"),
            changeFreq: "yearly",
            priority: 0.4
        });

        for (const thingyEntry of thingyIndex) {
            const yearThingyIndexPath = thingyEntry[2];
            const prom = fsPromise.readFile(path.join(resolvedThingyPath, yearThingyIndexPath, "index.json"))
                .then(e => this._bufferToJSON(e))
                .then(yearThingyIndex => this._addYearThingyIndex(yearThingyIndexPath, yearThingyIndex));
            proms.push(prom);
        }

        await Promise.all(proms);

        this.thingiesAdded = true;
    }

    /**
     * @param {string} context
     * @param {YearThingyIndex} yearThingyIndex 
     */
    _addYearThingyIndex(context, yearThingyIndex) {
        for (const yearEntry of yearThingyIndex) {
            this.entries.push({
                url: url.resolve(this.siteUrl, path.join(context, yearEntry[1])),
                priority: 0.4
            });
        }
    }

    /**
     * @param {string} context 
     */
    async _writeOutIfShould(context) {
        if (this.thingiesAdded && this.viewListAdded) {
            this._writeOut(context);
        }
    }

    /**
     * @param {string} context 
     */
    _writeOut(context) {
        return fsPromise.writeFile(path.resolve(context, this.outPath), this.toString());
    }

    toString() {
        let body = "";

        for (const entry of this.entries) {
            body += "<url>";
            body += "<loc>" + this._escapeForXML(entry.url) + "</loc>";

            if (entry.lastModified !== undefined) {
                body += "<lastmod>" +
                    entry.lastModified.getUTCFullYear() + "-" +
                    (entry.lastModified.getUTCMonth() + 1) + "-" +
                    entry.lastModified.getUTCDate() +
                    "</lastmod>";
            }

            if (entry.changeFreq) {
                body += "<changefreq>" + entry.changeFreq + "</changefreq>";
            }

            if (entry.priority !== undefined) {
                body += "<priority>" + entry.priority + "</priority>";
            }

            body += "</url>";
        }

        return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
            body +
            '</urlset>';
    }

    /**
     * @param {Buffer} buffer 
     */
    _bufferToJSON(buffer) {
        return JSON.parse(buffer.toString());
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

module.exports = SitemapGenerator;