const path = require("path");
const webpack = require("webpack");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const GenerateViewAndWidgetList = require("./plugins/GenerateViewAndWidgetList");

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
            loaders: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // you can specify a publicPath here
                        // by default it uses publicPath in webpackOptions.output
                        publicPath: '../',
                        hmr: process.env.NODE_ENV === 'development',
                    },
                },
                'css-loader',
                'less-loader',
                path.resolve(__dirname, "./loaders/stylesheetVarMacro")
            ]
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
        }),
        new MiniCssExtractPlugin({
            // ignoreOrder: false, // Enable to remove warnings about conflicting order
        })
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },

    mode: "production",
    watch: false
};