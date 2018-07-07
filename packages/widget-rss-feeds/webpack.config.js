const path = require("path");
const conf = require("../../webpack.config");

module.exports = [
  Object.assign({}, conf, {
    entry: [path.join(__dirname, "src/widget.js")],
    output: {
      path: path.join(__dirname, "./bundle"),
      filename: "index.js",
      library: "bundle",
      libraryTarget: "umd",
      umdNamedDefine: true,
    },
  }),
  Object.assign({}, conf, {
    entry: [path.join(__dirname, "src/index.js")],
    output: {
      path: path.join(__dirname, "./dist"),
      filename: "index.js",
      library: "WidgetRssFeeds",
      libraryTarget: "umd",
      umdNamedDefine: true,
    },
    externals: {
      preact: "Preact",
    },
  }),
];
