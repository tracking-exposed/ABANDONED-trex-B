// @flow
import {send} from "micro";
import fs from "fs";
import path from "path";
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

  const feedEntities = feeds.toEntities(req.url);
  const feedLocation = path.join(
    cfg.dataPath,
    "feeds",
    `${feeds.toUrl(feedEntities)}.xml`,
  );

  if (feedEntities.length === 0) return;

  try {
    feed = await readFile(feedLocation);
    send(res, 200, feed);
  } catch (err) {
    if (err.code === "ENOENT") {
      const feedHeader = {
        title: `fbtrex observing: ${feedEntities.join(", ")}`,
        feed_url: req.url,
        site_url: "https://facebook.tracking.exposed/feeds",
        pubDate: new Date(),
      };
      feed = impressions.toRss(req.url, feedHeader, [
        {
          html: {
            source: "fbtrex RSS α-service",
            text:
              "Thanks for subscribing to this RSS, now it will begin to be populated, come back in a minute, and remember: more installation of the browser extention are running, more likely something interesting will be caught, read more on https://facebook.tracking.exposed",
            permaLink: "https://facebook.tracking.exposed",
            date: new Date(),
          },
        },
      ]);
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
