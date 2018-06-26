// @flow
import dotenv from "dotenv";
import {redis, mongo} from "@tracking-exposed/processor-cli";
import type {StreamEvent} from "@tracking-exposed/processor-cli/src/redis";

import {extractEntities} from "./dandelion";

dotenv.config();

const envOr = (orVal: string, key: string) =>
  process.env[key] == null ? orVal : process.env[key];

const dandelionToken = envOr("invalid", "TREX_DANDELION_API_TOKEN");
const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);
const mongoHost = envOr("localhost", "TREX_MONGO_HOST");
const mongoPort = envOr("27017", "TREX_MONGO_PORT");
const mongoDb = envOr("tracking-exposed", "TREX_MONGO_DB");

const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`;

const processor = async (
  event: StreamEvent,
  cfg: {streamTo: string},
): Promise<void> => {
  const redisClient = redis.client(redisHost, redisPort);
  const mongoClient = await mongo.client(mongoUri);

  const impression = await mongo.fetchImpression(
    mongoClient,
    event.impressionId,
  );

  if (impression && impression.text) {
    const annotations = await extractEntities(impression.text, dandelionToken);
    await Promise.all(
      annotations.map((annotation) =>
        redis.publishToStream(redisClient, cfg.streamTo, annotation),
      ),
    );
  }
};

export default processor;
