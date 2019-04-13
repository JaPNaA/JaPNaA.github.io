const prodConfig = require("./webpack.config");

const devConfig = {
    ...prodConfig,
    mode: "development",
    watch: true,
    devtool: 'inline-source-map'
}

module.exports = devConfig;