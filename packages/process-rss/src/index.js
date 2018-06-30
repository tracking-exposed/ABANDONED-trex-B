// @flow
import fs from "fs";
import path from "path";
import {redis, mongo, entities, impressions} from "@tracking-exposed/data";
import {ageingMemoize, envOr} from "@tracking-exposed/utils";

import dotenv from "dotenv";
import type {StreamEvent} from "@tracking-exposed/data/src/redis";

import {mkdirP} from "./utils";

dotenv.config();

const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);
const mongoHost = envOr("localhost", "TREX_MONGO_HOST");
const mongoPort = envOr("27017", "TREX_MONGO_PORT");
const mongoDb = envOr("tracking-exposed", "TREX_MONGO_DB");
const feedsLocation = path.join(
  process.cwd(),
  envOr("feeds", "TREX_FEEDS_LOCATION"),
);

const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`;

const redisClient = () => redis.client(redisHost, redisPort);
const mongoClient = ageingMemoize(() => mongo.client(mongoUri), 10000);

const ensureFeedsLocation = () => mkdirP(feedsLocation);

const processor = async ({data}: StreamEvent): Promise<void> => {
  await ensureFeedsLocation();
  const {title: entity} = data;
  const urls = await entities.fetchFeeds(redisClient(), entity);
  if (urls.length === 0) return;

  const items = await impressions.fetchByEntity(await mongoClient(), entity);
  if (items.length === 0) return;
  urls.forEach((url) =>
    fs.writeFileSync(
      path.join(feedsLocation, url),
      impressions.toRss(url, items),
    ),
  );
};

export default processor;
