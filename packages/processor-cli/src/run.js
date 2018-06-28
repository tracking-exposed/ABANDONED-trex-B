// @flow
import {redis} from "@tracking-exposed/data";
import {envOr} from "@tracking-exposed/utils";
import dotenv from "dotenv";
import cli from "./cli";
import loader from "./loader";
import {runForever} from "./loop";

dotenv.config();

const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);

const registerShutdown = (fn: () => mixed): void => {
  let run = false;
  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };
  process.on("SIGINT", () => {
    wrapper();
    process.exit(128);
  });
  process.on("SIGTERM", () => {
    wrapper();
    process.exit(128);
  });
  process.on("exit", wrapper);
};

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const redisClient = redis.client(redisHost, redisPort);
  const processor = await loader(cfg.processor);

  // eslint-disable-next-line no-console
  registerShutdown(() => console.log("Shutting down."));
  // eslint-disable-next-line no-console
  console.log("Starting to poll events.");

  let id = "$";

  runForever(async () => {
    const events = await redis.pollFromStream(redisClient, cfg.stream, id);
    const lastEvent = events.slice(-1)[0];
    // eslint-disable-next-line prefer-destructuring
    id = lastEvent.id;
    await Promise.all(events.map((event) => processor(event, cfg)));
  });
};
