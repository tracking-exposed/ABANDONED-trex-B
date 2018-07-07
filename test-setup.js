const {JSDOM} = require("jsdom");

const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

require("@babel/register")({
  babelrc: false,
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-flow",
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-syntax-flow",
    ["@babel/plugin-transform-react-jsx", {pragma: "h"}],
    "@babel/plugin-proposal-class-properties",
    "css-modules-transform",
    "istanbul",
  ],
});
