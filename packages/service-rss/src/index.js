// @flow
import {send} from "micro";
import fs from "fs";
import path from "path";
import {promisify} from "util";
import {redis, impressions, entities} from "@tracking-exposed/data";
import {mkdirP} from "@tracking-exposed/utils";
import type {IncomingMessage, ServerResponse} from "http";

import {toEntities} from "./utils";

type ServiceRssCfg = {
  redisHost: string,
  redisPort: number,
  dataPath: string,
};

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export default (cfg: ServiceRssCfg) => async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const redisClient = redis.client(cfg.redisHost, cfg.redisPort);

  let feed;
  const feedEntities = toEntities(req.url);
  if (feedEntities.length === 0) return;

  const feedLocation = path.join(cfg.dataPath, "feeds", path.basename(req.url));

  try {
    feed = await readFile(feedLocation);
    send(res, 200, feed);
  } catch (err) {
    if (err.code === "ENOENT") {
      feed = impressions.toRss(req.url, []);
      send(res, 200, feed);
      await entities.storeFeeds(redisClient, feedEntities, req.url);
      await entities.publishEntities(redisClient, feedEntities);
      await mkdirP(path.dirname(feedLocation));
      await writeFile(feedLocation, feed);
    } else {
      throw err;
    }
  }
};
