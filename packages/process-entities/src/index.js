// @flow
import dotenv from "dotenv";
import {redis} from "@tracking-exposed/processor-cli";
import type {StreamEvent} from "@tracking-exposed/processor-cli/src/redis";

import {extractEntities} from "./dandelion";

const {client, publishToStream} = redis;

dotenv.config();

const envOr = (orVal: string, key: string) =>
  process.env[key] == null ? orVal : process.env[key];

const dandelionToken = envOr("invalid", "TREX_DANDELION_API_TOKEN");
const redisHost = envOr("localhost", "TREX_REDIS_HOST");
const redisPort = parseInt(envOr("6379", "TREX_REDIS_PORT"), 10);

const redisClient = client(redisHost, redisPort);

const processor = async (
  event: StreamEvent,
  cfg: {streamTo: string},
): Promise<void> => {
  const annotations = await extractEntities(event.message, dandelionToken);
  const ids = await Promise.all(
    annotations.map((annotation) =>
      publishToStream(cfg.streamTo, annotation, redisClient),
    ),
  );
  console.log(ids);
};

export default processor;
