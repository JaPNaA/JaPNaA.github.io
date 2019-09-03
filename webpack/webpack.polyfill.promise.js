const path = require("path");

module.exports = {
    name: "promise-polyfill",
    entry: "./node_modules/promise-polyfill/src/index.js",
    output: {
        path: path.resolve(__dirname, "../public/bundles"),
        filename: 'promise-polyfill.js',
        publicPath: "/bundles/"
    },
    resolve: {
        extensions: ['.js']
    },
    target: "web",

    mode: "production",
    watch: false
};