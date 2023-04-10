const path = require("path");

module.exports = {
    entry: "./scripts/src/index.ts",
    output: {
        path: path.resolve(__dirname, "../scripts/build"),
        filename: "bundle.js",
        library: "scripts",
        libraryTarget: "commonjs"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "ts-loader",
            options: {
                configFile: path.resolve(__dirname, "../scripts/tsconfig.json")
            },
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