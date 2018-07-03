// @flow
import {redis, mongo, impressions} from "@tracking-exposed/data";
import type {StreamEvent} from "@tracking-exposed/data/src/redis";

import {extractEntities} from "./dandelion";

type ProcessEntitiesCfg = {
  dandelionToken: string,
  redisHost: string,
  redisPort: number,
  mongoHost: string,
  mongoPort: number,
  mongoDb: string,
  dataPath: string,
  streamTo: string,
};

const processor = async (
  {data}: StreamEvent,
  cfg: ProcessEntitiesCfg,
): Promise<void> => {
  const mongoUri = `mongodb://${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDb}`;
  const mongoClient = await mongo.client(mongoUri);
  const redisClient = redis.client(cfg.redisHost, cfg.redisPort);

  const impression = await impressions.fetch(mongoClient, data.impressionId);

  if (
    impression &&
    impression.visibility === "public" &&
    impression.html.text
  ) {
    const annotations = await extractEntities(
      impression.html.text,
      cfg.dandelionToken,
    );

    await impressions.addEntities(
      mongoClient,
      impression.id,
      annotations.map(({title}) => title),
    );
    await Promise.all(
      annotations.map((annotation) =>
        redis.publishToStream(redisClient, cfg.streamTo, annotation),
      ),
    );
  }
};

export default processor;
