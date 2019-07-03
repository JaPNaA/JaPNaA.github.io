const path = require("path");

module.exports = {
    entry: "./scripts/src/parse-v2-format.ts",
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
};