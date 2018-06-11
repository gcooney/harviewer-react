const config = require("./webpack.config");

config.mode = "production";
config.output.filename = "./[name].entry.js";

module.exports = config;
