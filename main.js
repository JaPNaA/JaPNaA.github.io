// @ts-nocheck
const webpack = require("webpack");
const fs = require("fs");
const path = require("path");

const scriptsConfig = require("./webpack/webpack.scripts.config");

const mode = process.argv[2].toLowerCase();
const watch = process.argv[3] && process.argv[3].toLowerCase()[0] === 'w';

if (mode === "dev") {
    const devConfig = require("./webpack/webpack.dev.config");
    startWebpack(devConfig);
} else if (mode === "prod") {
    const prodConfig = require("./webpack/webpack.config");
    startWebpack(prodConfig);
} else if (mode === "clean") {
    cleanProject();
} else {
    console.error("unknown mode '" + mode + "'");
}


function startWebpack(config) {
    setWatch(config, false);

    if (watch) {
        console.log("webpack is watching the files...");
    }

    const joinedConfigs = joinConfigs(config, scriptsConfig);
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


    webpack.WatchIgnorePlugin
}

function setWatch(config, watch) {
    if (Array.isArray(config)) {
        for (const item of config) {
            item.watch = watch;
        }
    }

    config.watch = watch;
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