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
    .command("start", "Start up a stream processor", (y) =>
      y
        .option("stream", {
          required: true,
          type: "string",
          desc: "The stream to poll.",
        })
        .alias("stream", "s")
        .option("stream-to", {
          type: "string",
          desc: "The stream to push to.",
        })
        .alias("stream-to", "S")
        .option("processor", {
          required: true,
          type: "string",
          desc: "Process events using this processor.",
        })
        .alias("processor", "p"),
    )
    .config(config)
    .pkgConf("processor")
    .demandCommand()
    .help()
    .wrap(72);
};
