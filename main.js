// @ts-nocheck
const webpack = require("webpack");
const fs = require("fs");
const path = require("path");
const hs = require("http-server");
const portfinder = require("portfinder");

const scriptsConfig = require("./webpack/webpack.scripts.config");

const mode = process.argv[2] && process.argv[2].toLowerCase();
const watch = process.argv[3] && process.argv[3].toLowerCase()[0] === 'w';

if (mode === "dev") {
    const devConfig = require("./webpack/webpack.dev.config");
    startWebpack(devConfig, "development");
    startHttpServers();
} else if (mode === "prod") {
    const prodConfig = require("./webpack/webpack.config");
    startWebpack(prodConfig, "production");
} else if (mode === "clean") {
    cleanProject();
} else if (mode === "scripts") {
    startWebpack([], "development");
} else if (mode === "serve") {
    startHttpServers();
} else {
    console.error("unknown mode '" + mode + "'");
    console.log("Available modes: dev (w), prod (w), scripts (w), clean, serve");
    console.log("Add 'w' as third argument for watch");
}


function startWebpack(config, mode) {
    setWatch(config, false); // watch: true in the config seems to mess things up

    if (watch) {
        console.log("webpack is watching the files...");
    }

    const joinedConfigs = joinConfigs(config, scriptsConfig);
    setMode(joinedConfigs, mode);

    /** @type {import("webpack").MultiCompiler} */
    const compiler = webpack(joinedConfigs, function (err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log(stats.toString({
                colors: true
            }));
        }

        if (watch) {
            compiler.watch({
                ignored: ["node_modules", "bower_components", "components"]
            }, function (err, stats) {
                if (err) {
                    console.error(err);
                }
                console.log(stats.toString({
                    all: false,
                    modules: true,
                    errors: true,
                    warnings: true,
                    colors: true
                }));
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
        root: path.resolve(__dirname, "./docs")
    });
    const server2 = hs.createServer({
        root: path.resolve(__dirname, "../../../Thingy"),
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

function cleanProject() {
    const files = fs.readFileSync(".gitignore").toString().split("\n");
    let shouldClean = false;

    for (const file of files) {
        const partialFileName = file.trim();
        if (!partialFileName.trim()) { continue; }
        if (partialFileName.startsWith("#")) {
            if (partialFileName === "# START-REMOVABLE-FILES") {
                shouldClean = true;
                continue;
            } else if (partialFileName === "# END-REMOVABLE-FILES") {
                shouldClean = false;
                continue;
            }
        }

        if (!shouldClean) { continue; }
        let filePath = path.join(__dirname, partialFileName);

        if (fs.existsSync(filePath)) {
            if (fs.statSync(filePath).isDirectory()) {
                console.log("Removing directory " + filePath);
                recursiveRemoveDirectory(filePath, rmCallback);
            } else {
                console.log("Removing file " + filePath);
                fs.unlink(filePath, rmCallback);
            }
        }
    }
}

function recursiveRemoveDirectory(dirPath, cb) {
    let remaining = 0;
    let rmdirRetries = 0;

    function update() {
        if (remaining <= 0) {
            remove();
        }
    }

    function remove() {
        fs.rmdir(dirPath, function (err) {
            if (rmdirRetries > 3) {
                console.error(err);
                return;
            }
            if (err) {
                remove();
                rmdirRetries++;
            }
        });
    }

    fs.readdir(dirPath, function (err, files) {
        if (err) { throw err; }
        let any = false;
        for (const file of files) {
            any = true;
            remaining++;
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, function (err, stats) {
                if (err) { throw err; }
                if (stats.isDirectory()) {
                    recursiveRemoveDirectory(filePath, function () {
                        remaining--;
                        update();
                    });
                } else {
                    fs.unlink(filePath, rmCallback);
                    remaining--;
                    update();
                }
            });
        }

        if (!any) { update(); }
    });
}

function rmCallback(err) {
    if (err) {
        console.error(err);
    }
}