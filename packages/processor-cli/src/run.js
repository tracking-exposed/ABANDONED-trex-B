// @flow
import fs from "fs";
import path from "path";
import {promisify} from "util";
import {redis} from "@tracking-exposed/data";
import {registerShutdown, loadPkg} from "@tracking-exposed/utils";
import cli from "./cli";
import {runForever} from "./loop";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const redisClient = redis.client(cfg.redisHost, cfg.redisPort);
  const processor = await loadPkg(cfg.processor);
  const idCache = path.join(
    process.cwd(),
    `.${path.basename(cfg.processor)}.cache`,
  );

  // eslint-disable-next-line no-console
  registerShutdown(() => console.log("Shutting down."));
  // eslint-disable-next-line no-console
  console.log("Starting to poll events.");

  let id;
  try {
    id = await readFile(idCache);
    if (id == null || id === "" || typeof id !== "string") id = "$";
  } catch (err) {
    if (err.code === "ENOENT") {
      id = "$";
    } else {
      throw err;
    }
  }
  // eslint-disable-next-line no-console
  console.info(`Polling events since "${id}"`);

  runForever(async () => {
    const events = await redis.pollFromStream(redisClient, cfg.stream, id);
    // eslint-disable-next-line no-console
    console.log(
      `Polled ${events.length} event${events.length > 1 ? "s" : ""} from ${
        cfg.stream
      }.`,
    );

    await Promise.all(
      events.map(async (event) => {
        try {
          await processor(event, cfg);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(`Error processing event: ${JSON.stringify(event)}`);
          // eslint-disable-next-line no-console
          console.log(e);
        }
      }),
    );

    const lastEvent = events.slice(-1)[0];
    await writeFile(idCache, lastEvent.id);
    // eslint-disable-next-line prefer-destructuring
    id = lastEvent.id;
  });
};
