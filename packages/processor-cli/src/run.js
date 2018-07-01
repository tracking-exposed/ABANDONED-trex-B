// @flow
import {redis} from "@tracking-exposed/data";
import {envOr, registerShutdown, loadPkg} from "@tracking-exposed/utils";
import dotenv from "dotenv";
import cli from "./cli";
import {runForever} from "./loop";

dotenv.config();

const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const redisClient = redis.client(redisHost, redisPort);
  const processor = await loadPkg(cfg.processor);

  // eslint-disable-next-line no-console
  registerShutdown(() => console.log("Shutting down."));
  // eslint-disable-next-line no-console
  console.log("Starting to poll events.");

  let id = "$";

  runForever(async () => {
    const events = await redis.pollFromStream(redisClient, cfg.stream, id);
    // eslint-disable-next-line no-console
    console.log(
      `Polled ${events.length} event${events.length > 1 ? "s" : ""} from ${
        cfg.stream
      }.`,
    );
    const lastEvent = events.slice(-1)[0];
    // eslint-disable-next-line prefer-destructuring
    id = lastEvent.id;
    await Promise.all(events.map((event) => processor(event, cfg)));
  });
};
