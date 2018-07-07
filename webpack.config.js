const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: "> 0.2%",
                },
              },
            ],
            "@babel/preset-flow",
            "@babel/preset-react",
          ],
          plugins: [
            ["@babel/plugin-transform-react-jsx", {pragma: "h"}],
            "@babel/plugin-transform-flow-strip-types",
            "@babel/plugin-syntax-flow",
            "@babel/plugin-proposal-class-properties",
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader?url=false", // Append url=false to make leaflet render correctly.
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
