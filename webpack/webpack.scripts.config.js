const path = require("path");

module.exports = [{
    entry: "./scripts/src/parse-v2-format/parse-v2-format.ts",
    output: {
        path: path.resolve(__dirname, "../scripts/build"),
        filename: "parse-v2-format.js"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    target: "node",
    plugins: [],

    mode: "production",
    watch: false
}, {
    entry: "./scripts/src/update-index-json/update-index-json.ts",
    output: {
        path: path.resolve(__dirname, "../scripts/build"),
        filename: "update-index-json.js"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    target: "node",
    plugins: [],

    mode: "production",
    watch: false
}];