const merge = require("webpack-merge");
const common = require("./webpack.client.common.js");

module.exports = merge(common, {
  mode: `production`
});
