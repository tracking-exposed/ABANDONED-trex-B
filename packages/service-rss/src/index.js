// @flow
import {redis, impressions, entities} from "@tracking-exposed/data";
import {envOr} from "@tracking-exposed/utils";
import {send} from "micro";
import fs from "fs";
import path from "path";
import {promisify} from "util";
import type {IncomingMessage, ServerResponse} from "http";

import {toEntities} from "./utils";

const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const redisClient = (host: string = "localhost", port: number = 6379) =>
  redis.client(host, port);

export default async (req: IncomingMessage, res: ServerResponse) => {
  let feed;
  const feedEntities = toEntities(req.url);
  if (feedEntities.length === 0) return;

  const feedPath = `/tmp/feeds/${path.basename(req.url)}`;

  try {
    feed = await readFile(feedPath);
    send(res, 200, feed);
  } catch (err) {
    if (err.code === "ENOENT") {
      feed = impressions.toRss(req.url, []);
      send(res, 200, feed);
      await entities.storeFeeds(
        redisClient(redisHost, redisPort),
        feedEntities,
        req.url,
      );
      await Promise.all(
        feedEntities.map((entity) =>
          redis.publishToStream(redisClient(), "entities", {title: entity}),
        ),
      );
      await writeFile(feedPath, feed);
    } else {
      throw err;
    }
  }
};
