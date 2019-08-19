const path = require("path");
const webpack = require("webpack");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const GenerateViewAndWidgetList = require("./plugins/GenerateViewAndWidgetList");

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

module.exports = [{
    name: "dist",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "../docs/bundles"),
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
}, {
    name: "darkModeCSS",
    entry: "./styles/darkMode.less",
    output: {
        path: path.resolve(__dirname, "../docs/bundles"),
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
            filename: 'darkMode.css'
        })
    ],
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
    },

    mode: "production",
    watch: false
}];