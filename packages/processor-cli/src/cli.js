// @flow
import yargs from "yargs";
import findUp from "find-up";
import fs from "fs";

export default () => {
  const configPath = findUp.sync([".processorrc", ".processor.json"]);
  const config = configPath
    ? JSON.parse(fs.readFileSync(configPath).toString())
    : {};

  return (
    yargs
      .option("redis-host", {
        default: "localhost",
        type: "string",
        desc: "The host name of the Redis instance.",
      })
      .options("redis-port", {
        default: 6379,
        type: "number",
        desc: "The port of the Redis instance.",
      })
      .option("mongo-host", {
        default: "localhost",
        type: "string",
        desc: "The host name of the MongoDb instance.",
      })
      .options("mongo-port", {
        default: 27017,
        type: "number",
        desc: "The port of the MongoDB instance.",
      })
      .options("mongo-db", {
        default: "tracking-exposed",
        type: "string",
        desc: "The name of the MongoDB database.",
      })
      .option("data-path", {
        default: "/tmp",
        type: "string",
        desc: "The path to the data base directory.",
      })
      // FIXME: This processor specific option should be better defined in the plugin
      .option("dandelion-token", {
        type: "string",
        desc: "The token for the dandelion service.",
      })
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
      .env("TREX")
      .demandCommand()
      .help()
      .wrap(72)
  );
};
