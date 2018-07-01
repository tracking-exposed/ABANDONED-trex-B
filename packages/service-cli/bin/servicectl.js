#!/usr/bin/env node
const {run} = require("..");

process.on("unhandledRejection", (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

run();
