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
  ],
  plugins: [
    "@babel/plugin-transform-flow-strip-types",
    "@babel/plugin-syntax-flow",
    "istanbul",
  ],
});
