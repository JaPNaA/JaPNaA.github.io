const prodConfig = require("./webpack.config");
const path = require("path");

const devConfig = {
    ...prodConfig,
    mode: "development",
    watch: true,
    devtool: 'inline-source-map'
}

const testConfig = {
    name: "test",
    entry: "./test/main.ts",
    output: {
        path: path.resolve(__dirname, "docs"),
        filename: "test-bundle.js",
        publicPath: "./test/"
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            loaders: ['style-loader', 'css-loader', 'less-loader']
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    target: "web",
    plugins: [],

    mode: "development",
    watch: true
};

module.exports = [devConfig, testConfig];