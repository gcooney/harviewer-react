const configs = require("./webpack.config");

configs.forEach((config) => {
  config.mode = "production";
});

module.exports = configs;
