// @flow
import fs from "fs";
import path from "path";
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
  const feedsLocation = path.join(cfg.dataPath, "feeds");
  const mongoUri = `mongodb://${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDb}`;
  const redisClient = redis.client(cfg.redisHost, cfg.redisPort);
  const mongoClient = await mongo.client(mongoUri);

  await mkdirP(feedsLocation);
  const {entity} = data;
  const urls = await entities.fetchFeeds(redisClient, entity);
  if (urls.length === 0) return;

  const items = await impressions.fetchByEntity(mongoClient, entity);
  if (items.length === 0) return;
  urls.forEach((url) =>
    fs.writeFileSync(
      path.join(feedsLocation, url),
      impressions.toRss(url, items),
    ),
  );
};

export default processor;
