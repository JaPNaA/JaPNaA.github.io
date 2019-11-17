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
        }, {
            loader: 'css-loader',
            options: {
                modules: {
                    mode: 'local',
                    localIdentName: '[local]__[hash:base64:5][name]'
                },
                sourceMap: true
            }
        },
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
                    path.resolve(__dirname, "./loaders/routeMacro"),
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
            routesList: {
                indexRoutesPath: "src/elm/views/routes.ts"
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
            generateHTMLFiles: {
                outDirectory: "build",
                templatePage: "public/_pageTemplate.html",
                createIndexPage: true,
                baseReplacementMap: {
                    "description": "No description provided"
                },
                indexReplacementMap: {
                    "description": "JaPNaA's website. (It's very nice)"
                }
            },
            generateSitemap: {
                outPath: "build/mainSitemap.xml",
                thingyPath: "../../../Thingy",
                siteUrl: "https://japnaa.github.io/"
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