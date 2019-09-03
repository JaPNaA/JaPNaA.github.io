const prodConfigs = require("./webpack.config");
const path = require("path");

const devConfigs = [];

for (const prodConfig of prodConfigs) {
    devConfigs.push({
        ...prodConfig,
        mode: "development",
        watch: true,
        devtool: 'inline-source-map'
    });
}

const testConfig = {
    name: "test",
    entry: "./test/main.ts",
    output: {
        path: path.resolve(__dirname, "../build/bundles"),
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

module.exports = [...devConfigs, testConfig];