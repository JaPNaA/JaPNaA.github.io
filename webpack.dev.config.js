const prodConfig = require("./webpack.config");

const devConfig = {
    ...prodConfig,
    mode: "development",
    watch: true
}

module.exports = devConfig;