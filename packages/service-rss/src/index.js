// @flow
import {send} from "micro";
import fs from "fs";
import path from "path";
import {URL} from "url";
import {promisify} from "util";
import {redis, impressions, entities, feeds} from "@tracking-exposed/data";
import {mkdirP} from "@tracking-exposed/utils";
import type {IncomingMessage, ServerResponse} from "http";

type ServiceRssCfg = {
  redisHost: string,
  redisPort: number,
  dataPath: string,
};

export default (cfg: ServiceRssCfg) => async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const writeFile = promisify(fs.writeFile);
  const readFile = promisify(fs.readFile);
  const redisClient = redis.client(cfg.redisHost, cfg.redisPort);

  let feed;
  const feedUrl = new URL(req.url).href;
  const feedEntities = feeds.toEntities(feedUrl);
  if (feedEntities.length === 0) return;

  const feedLocation = path.join(cfg.dataPath, "feeds", feedUrl);

  try {
    feed = await readFile(feedLocation);
    send(res, 200, feed);
  } catch (err) {
    if (err.code === "ENOENT") {
      feed = impressions.toRss(feedUrl, []);
      send(res, 200, feed);
      await entities.storeFeeds(redisClient, feedEntities, feedUrl);
      await entities.publishEntities(redisClient, feedEntities);
      await mkdirP(path.dirname(feedLocation));
      await writeFile(feedLocation, feed);
    } else {
      throw err;
    }
  }
};
