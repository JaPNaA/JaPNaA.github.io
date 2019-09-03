const Component = require("./Component");

/**
 * @typedef {import("webpack").compilation.Compilation} Webpack.Compilation
 * @typedef { { runScript: { fn: () => void, once: boolean } } } RunScriptsOptions
 */

class RunScript extends Component {
    /**
     * @param {RunScriptsOptions} options 
     */
    constructor(options) {
        super();
        this.scriptFn = options.runScript.fn;
        this.once = options.runScript.once;
        this.ranOnce = false;
    }

    /**
     * @param {Webpack.Compilation} compilation 
     */
    async afterEmit(compilation) {
        if (this.once && this.ranOnce) { return; }
        this.ranOnce = true;

        return this.scriptFn();
    }
}

module.exports = RunScript;