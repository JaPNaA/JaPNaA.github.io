const path = require("path");
const GenerateViewAndWidgetList = require("./plugins/GenerateViewAndWidgetList");
const webpack = require("webpack");

module.exports = {
    name: "dist",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "../docs/bundles"),
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: "/bundles/"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loaders: [
                "ts-loader",
                path.resolve(__dirname, "./loaders/stripConsoleLogs")
            ],
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            loaders: ['style-loader', 'css-loader', 'less-loader']
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    target: "web",
    plugins: [
        new GenerateViewAndWidgetList(),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 20 * 1024 // 20KiB
        })
    ],

    mode: "production",
    watch: false
};