const path = require("path");
const webpack = require("webpack");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const Plugin = require("./plugin/plugin");

const lessLoader = {
    test: /\.less$/,
    loaders: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: process.env.NODE_ENV === 'development',
            },
        },
        'css-loader',
        'less-loader',
        path.resolve(__dirname, "./loaders/stylesheetVarMacro"),
        path.resolve(__dirname, "./loaders/stylesheetDoubleDefineMacro")
    ]
};

const promisePolyfillConfig = require("./webpack.polyfill.promise.js");

module.exports = [{
    name: "dist",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "../build/bundles"),
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: "/bundles/"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    "ts-loader",
                    path.resolve(__dirname, "./loaders/stripConsoleLogs")
                ],
                exclude: /node_modules/
            },
            lessLoader
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.less']
    },
    target: "web",
    plugins: [
        new Plugin({
            viewList: {
                pathToViews: "src/elm/views",
                outFileName: "viewList.ts"
            },
            widgetList: {
                pathToWidgets: "src/elm/widgets",
                outFileName: "widgetList.ts"
            },
            runScript: {
                fn: function () {
                    // @ts-ignore
                    require("../scripts/build/bundle").scripts.default();
                },
                once: true
            },
            copyDirectories: {
                from: "public",
                to: "build"
            },
            generateViewHTML: {
                outDirectory: "build",
                templatePage: "public/_pageTemplate.html",
                createIndexPage: true,
                baseReplacementMap: {
                    "description": "JaPNaA's website. (It's very nice)"
                }
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 2 * 1024 // 2KiB
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
}, {
    name: "darkModeCSS",
    entry: "./styles/darkMode.less",
    output: {
        path: path.resolve(__dirname, "../build/bundles"),
        filename: '_uselessFile.js',
        publicPath: "/bundles/"
    },
    module: {
        rules: [lessLoader]
    },
    resolve: {
        extensions: ['.less']
    },
    target: "web",
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'darkTheme.css'
        })
    ],
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
    },

    mode: "production",
    watch: false
}, promisePolyfillConfig];