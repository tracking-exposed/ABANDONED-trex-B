const conf = require("../webpack.config");

module.exports = Object.assign({}, conf, {
  resolve: {
    extensions: [".js", "jsx"],
    alias: {
      react: "preact-compat",
      "react-dom": "preact-compat",
    },
  },
  externals: {},
});
