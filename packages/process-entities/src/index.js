// @flow
import {redis, mongo, impressions} from "@tracking-exposed/data";
import {ageingMemoize, envOr, env} from "@tracking-exposed/utils";
import dotenv from "dotenv";

import type {StreamEvent} from "@tracking-exposed/data/src/redis";

import {extractEntities} from "./dandelion";

dotenv.config();

const dandelionToken = env("TREX_DANDELION_API_TOKEN");
const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);
const mongoHost = envOr("localhost", "TREX_MONGO_HOST");
const mongoPort = envOr("27017", "TREX_MONGO_PORT");
const mongoDb = envOr("tracking-exposed", "TREX_MONGO_DB");

const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`;

const redisClient = () => redis.client(redisHost, redisPort);
const mongoClient = ageingMemoize(() => mongo.client(mongoUri), 10000);

const processor = async (
  event: StreamEvent,
  cfg: {streamTo: string},
): Promise<void> => {
  const impression = await impressions.fetch(
    await mongoClient(),
    event.impressionId,
  );

  if (impression && impression.text) {
    const annotations = await extractEntities(impression.text, dandelionToken);
    await Promise.all(
      annotations.map((annotation) =>
        redis.publishToStream(redisClient(), cfg.streamTo, annotation),
      ),
    );
  }
};

export default processor;
