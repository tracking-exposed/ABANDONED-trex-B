// @flow
import {redis, mongo, entities, impressions} from "@tracking-exposed/data";
import {ageingMemoize, envOr} from "@tracking-exposed/utils";
import RSS from "rss";

import dotenv from "dotenv";
import type {StreamEvent} from "@tracking-exposed/data/src/redis";

dotenv.config();

const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);
const mongoHost = envOr("localhost", "TREX_MONGO_HOST");
const mongoPort = envOr("27017", "TREX_MONGO_PORT");
const mongoDb = envOr("tracking-exposed", "TREX_MONGO_DB");

const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`;

const redisClient = () => redis.client(redisHost, redisPort);
const mongoClient = ageingMemoize(() => mongo.client(mongoUri), 10000);

const processor = async ({data}: StreamEvent): Promise<void> => {
  const {title: entity} = data;
  const urls = await entities.fetchFeeds(redisClient(), entity);
  if (urls.length === 0) return;

  const feedItems = await impressions.fetchByEntity(
    await mongoClient(),
    entity,
  );
  if (feedItems.length === 0) return;
  urls.forEach((url) => {
    const feed = new RSS({
      title: "Great RSS feed",
      feed_url: `https://tracking.exposed/feeds/${url}`,
      site_url: "https://tracking.exposed",
    });
    feedItems.forEach((item) => {
      if (!item.html.permaLink || !item.html.text) return;
      feed.item({
        title: "Some title",
        description: item.html.text,
        url: item.html.permaLink,
      });
    });
    const xml = feed.xml({indent: true});
    console.log(xml);
  });
};

export default processor;
