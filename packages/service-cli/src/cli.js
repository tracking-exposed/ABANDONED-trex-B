// @flow
import yargs from "yargs";
import findUp from "find-up";
import fs from "fs";

export default () => {
  const configPath = findUp.sync([".processorrc", ".processor.json"]);
  const config = configPath
    ? JSON.parse(fs.readFileSync(configPath).toString())
    : {};

  return yargs
    .config(config)
    .env("TREX")
    .pkgConf("processor")
    .demandCommand()
    .help()
    .wrap(72);
};
