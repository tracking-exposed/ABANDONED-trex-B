// @flow
import fs from "fs";
import path from "path";
import {promisify} from "util";
import {redis, mongo, entities, impressions} from "@tracking-exposed/data";
import {mkdirP} from "@tracking-exposed/utils";

import type {StreamEvent} from "@tracking-exposed/data/src/redis";

type ProcessRssCfg = {
  redisHost: string,
  redisPort: number,
  mongoHost: string,
  mongoPort: number,
  mongoDb: string,
  dataPath: string,
};

const processor = async (
  {data}: StreamEvent,
  cfg: ProcessRssCfg,
): Promise<void> => {
  const writeFile = promisify(fs.writeFile);
  const feedsLocation = path.join(cfg.dataPath, "feeds");
  const entitiesLocation = path.join(cfg.dataPath, "all-entities.json");
  const mongoUri = `mongodb://${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDb}`;
  const redisClient = redis.client(cfg.redisHost, cfg.redisPort);
  const mongoClient = await mongo.client(mongoUri);

  await mkdirP(feedsLocation);
  const {entity} = data;
  const urls = await entities.fetchFeeds(redisClient, entity);
  // eslint-disable-next-line no-console
  console.log(`Fetched ${urls.length} urls for ${entity}.`);
  if (urls.length === 0) return;

  await Promise.all(
    urls.map(async (url) => {
      const urlEntities = await entities.fetchByFeed(redisClient, url);
      const items = await impressions.fetchByEntities(mongoClient, urlEntities);
      if (items.length === 0) return;
      const feedLocation = path.join(feedsLocation, `${url}.xml`);
      await writeFile(
        feedLocation,
        impressions.toRss(
          url,
          {
            title: `fbtrex observing: ${urlEntities.join(", ")}`,
            feed_url: url,
            site_url: "https://facebook.tracking.exposed/feed",
            pubDate: new Date(),
          },
          items,
        ),
      );
      // eslint-disable-next-line no-console
      console.log(
        `Generated RSS feed for ${urlEntities.join(
          ",",
        )} at ${feedLocation} with ${items.length} items.`,
      );
    }),
  );

  // FIXME: Move the all-entities generation into a separate process.
  const allEntities = await entities.all(mongoClient);
  // eslint-disable-next-line no-console
  console.log(`Caching ${allEntities.length} entities to ${entitiesLocation}.`);
  await writeFile(entitiesLocation, JSON.stringify(allEntities));
};

export default processor;
