const webpack = require("webpack");
const path = require("path");
const hs = require("http-server");
const portfinder = require("portfinder");
const deleteDirectory = require("./webpack/plugin/utils/deleteDirectory");
const fsPromise = require("./webpack/plugin/utils/fsPromise");

const scriptsConfig = require("./webpack/webpack.scripts.config");

const mode = process.argv[2] && process.argv[2].toLowerCase();
const watch = process.argv[3] && process.argv[3].toLowerCase()[0] === 'w';

const modeFunctionMap = {
    dev() {
        const devConfig = require("./webpack/webpack.dev.config");
        startWebpack(devConfig, "development");
        startHttpServers();
    },

    prod() {
        const prodConfig = require("./webpack/webpack.config");
        startWebpack(prodConfig, "production");
    },

    clean() {
        cleanProject();
    },

    scripts() {
        startWebpack([], "development");
    },

    serve() {
        startHttpServers();
    },

    runscripts() {
        try {
            // @ts-ignore
            require("./scripts/build/bundle").scripts.default();
        } catch (err) {
            console.error(err);
            console.log(":: Has the project been built?")
        }
    }
};

function main() {
    console.log("Node version: " + process.version);

    const fn = modeFunctionMap[mode];

    if (fn) {
        fn();
    } else {
        console.error("unknown mode '" + mode + "'");
        console.log("Available modes: " + Object.keys(modeFunctionMap).join(", "));
        console.log("Add 'w' as third argument for watch");
    }
}

function startWebpack(config, mode) {
    setWatch(config, false); // watch: true in the config seems to mess things up

    if (watch) {
        console.log("webpack is watching the files...");
    }

    const joinedConfigs = joinConfigs(config, scriptsConfig);
    setMode(joinedConfigs, mode);

    /** @type {import("webpack").MultiCompiler} */
    // @ts-ignore
    const compiler = webpack(joinedConfigs, function (err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log(stats ? stats.toString({
                colors: true
            }) : err);
        }

        if (watch) {
            compiler.watch({
                ignored: ["node_modules", "bower_components", "components"]
            }, function (err, stats) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stats ? stats.toString({
                    all: false,
                    modules: true,
                    errors: true,
                    warnings: true,
                    colors: true
                }) : err);
            });
        }
    });
}

function setWatch(config, watch) {
    if (Array.isArray(config)) {
        for (const item of config) {
            item.watch = watch;
        }
    } else {
        config.watch = watch;
    }
}

function setMode(config, mode) {
    if (Array.isArray(config)) {
        for (const item of config) {
            item.mode = mode;
        }
    } else {
        config.mode = mode;
    }
}

function joinConfigs(a, b) {
    if (Array.isArray(a)) {
        if (Array.isArray(b)) {
            return a.concat(b);
        } else {
            return [...a, b];
        }
    } else {
        if (Array.isArray(b)) {
            return [...b, a];
        } else {
            return [a, b];
        }
    }
}

// --- http-server ---

function startHttpServers() {
    portfinder.basePort = 8080;
    const server = hs.createServer({
        root: path.resolve(__dirname, "./build")
    });
    const server2 = hs.createServer({
        root: path.resolve(__dirname, "../"),
        // @ts-ignore
        cors: "*"
    });
    findPort();

    function findPort() {
        portfinder.getPort(function (err, port) {
            if (err) { throw err; }
            server.listen(port);
            // there doesn't seem to be a way to check if the following works, so let's just cross our fingers
            server2.listen(port + 1);
            console.log("Listening on ports " + port + " and " + (port + 1));
        });
    }
}

// --- clean ---

async function cleanProject() {
    const files = (await fsPromise.readFile(".gitignore")).toString().split("\n");
    let shouldClean = false;

    for (const file of files) {
        const partialFileName = file.trim();
        if (!partialFileName.trim()) { continue; }
        if (partialFileName.startsWith("#")) {
            if (partialFileName === "# START-REMOVABLE-FILES") {
                shouldClean = true;
            } else if (partialFileName === "# END-REMOVABLE-FILES") {
                shouldClean = false;
            }

            continue;
        }

        if (!shouldClean) { continue; }
        let filePath = path.join(__dirname, partialFileName);

        fsPromise.stat(filePath).then(stats => {
            if (stats.isDirectory()) {
                console.log("Removing directory " + filePath);
                deleteDirectory(filePath);
            } else {
                console.log("Removing file " + filePath);
                fsPromise.unlink(filePath);
            }
        }).catch(err => console.log("File " + filePath + " already doesn't exist"));
    }
}

main();