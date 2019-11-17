const resolveTSExtension = require("../utils/resolveTSExtension");

const getImports = require("../utils/getImports");

const Component = require("../Component");
const path = require("path");
const fsPromise = require("../utils/fsPromise");

const routerMatcher = /new Router\(\[([^]+)\](, .+)?\)/;

const routeMacroMatcher = require("../../regex/routeMacro").regexOnly;
const defaultRouteMatcher = /^\[("(.+?)"|'(.+?)'),\s*(.+)\]$/;
const importerMatcher = /^\(\)\s*=>\s*import\((("(.+?)")|('(.+?)'))\)$/;
const commaNotInSquareBracket = /((?<!\[),(?![\w\s]*\]))/g;

/**
 * @typedef {import("webpack").Compiler} Webpack.Compiler
 */
/**
* @typedef RoutesListOptionsInner
* @property {string} indexRoutesPath
*/
/**
* @typedef RoutesListOptions
* @property {RoutesListOptionsInner} routesList
*/
/**
 * @typedef Route
 * @property {string} name
 * @property {string} fileLocation
 */
/**
 * @typedef {(compiler: Webpack.Compiler) => (Promise<void> | void)} ChangeHandler
 */

class RoutesList extends Component {
    /**
     * @param {RoutesListOptions} options 
     */
    constructor(options) {
        super();

        this.indexRoutesPath = options.routesList.indexRoutesPath;

        /** @type {Route[]} */
        this.routes = [];

        /** @type {ChangeHandler[]} */
        this.changeHandlers = [];
    }

    /**
     * @param {Webpack.Compiler} compiler
     */
    async initalize(compiler) {
        await this._readRoutes(path.join(compiler.context, this.indexRoutesPath));
        await this._dispatchChange(compiler);
    }

    /**
     * @param {ChangeHandler} handler
     */
    onChange(handler) {
        this.changeHandlers.push(handler);
    }

    /**
     * @param {string} filePath absolute path
     * @param {string[]} [currentName_]
     */
    async _readRoutes(filePath, currentName_) {
        const srcString = await fsPromise.readFile(filePath).then(e => e.toString());
        const routerMatch = srcString.match(routerMatcher);
        const dirName = path.dirname(filePath);
        const currentName = currentName_ || [];

        if (!routerMatch) { throw new Error("Expected Router in file"); }

        const routes = routerMatch[1].split(commaNotInSquareBracket);
        const imports = getImports(srcString);

        /** @type {Promise[]} */
        const proms = [];

        for (const route of routes) {
            if (route === ",") { continue; }
            proms.push(this._parseRoute(route, currentName, dirName, imports));
        }

        await Promise.all(proms);
    }

    /**
     * @param {string} routeStr 
     * @param {string} currentPath
     * @param {string[]} currentName
     * @param {Map<string, string>} imports
     */
    async _parseRoute(routeStr, currentName, currentPath, imports) {
        const trimmed = routeStr.trim();

        const macroMatch = trimmed.match(routeMacroMatcher);
        if (macroMatch) {
            return this._parseRouteMacro(
                macroMatch[2] || macroMatch[3],
                currentName,
                currentPath
            );
        }

        const defaultMatch = trimmed.match(defaultRouteMatcher);
        if (defaultMatch) {
            return this._parseRouteDefault(
                defaultMatch[2] || defaultMatch[3],
                defaultMatch[4],
                currentName,
                currentPath,
                imports
            );
        }

        throw new Error("Failed to parse route '" + routeStr + "'");
    }

    /**
     * @param {string} arg argument to macro
     * @param {string[]} currentName
     * @param {string} currentPath
     */
    _parseRouteMacro(arg, currentName, currentPath) {
        const routeName = arg.slice(arg.lastIndexOf("/") + 1);

        this._addRoute(
            routeName, currentName,
            arg, currentPath
        );
    }

    /**
     * @param {string} name 
     * @param {string} route 
     * @param {string[]} currentName
     * @param {string} currentPath
     * @param {Map<string, string>} importNamePaths
     * @returns {Promise<void>}
     */
    async _parseRouteDefault(name, route, currentName, currentPath, importNamePaths) {
        const trimmed = route.trim();
        const importerMatch = trimmed.match(importerMatcher);

        if (importerMatch) {
            this._addRoute(
                name, currentName,
                "TODO: " + importerMatch[0], currentPath
            )
        } else {
            const importPath = path.join(currentPath, importNamePaths.get(route));
            if (importPath) {
                return this._readRoutes(importPath, currentName.concat([name]));
            } else {
                console.warn("Failed to find import for " + name);
            }
        }
    }

    /**
     * @param {string} routeName 
     * @param {string[]} currentName 
     * @param {string} routePath 
     * @param {string} currentPath 
     */
    _addRoute(routeName, currentName, routePath, currentPath) {
        this.routes.push({
            fileLocation: resolveTSExtension(path.join(currentPath, routePath)),
            name: currentName.concat([routeName]).join("/")
        });
    }

    /**
     * @param {Webpack.Compiler} compiler 
     */
    _dispatchChange(compiler) {
        const proms = [];

        for (const handler of this.changeHandlers) {
            const prom = handler(compiler);
            if (prom) {
                proms.push(prom);
            }
        }

        return Promise.all(proms);
    }
}

module.exports = RoutesList;