const path = require("path");

module.exports = {
    name: "dist",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: "/"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loaders: [
                "ts-loader",
                path.resolve(__dirname, "webpack/loaders/stripConsoleLogs")
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
    plugins: [],

    mode: "production",
    watch: false
};