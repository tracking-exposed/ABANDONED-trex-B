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
  if (urls.length === 0) return;

  urls.forEach(async (url) => {
    const urlEntities = await entities.fetchByFeed(redisClient, url);
    const items = await impressions.fetchByEntities(mongoClient, urlEntities);
    if (items.length === 0) return;
    await writeFile(
      path.join(feedsLocation, url),
      impressions.toRss(url, items),
    );
  });

  const allEntities = await entities.all(redisClient);
  await writeFile(entitiesLocation, JSON.stringify(allEntities));
};

export default processor;
