export default {
  require: ["./test-setup.js"],
  babel: {
    testOptions: {
      babelrc: false,
    },
  },
  sources: ["packages/*/src/**/*.js"],
  files: ["packages/*/test/**/*.js"],
};
