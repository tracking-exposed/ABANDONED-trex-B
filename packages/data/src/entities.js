// @flow
import type RedisClient from "ioredis";
import {addToSet, fetchSet, publishToStream} from "./redis";

export type Entity = {
  id: string,
  label: string,
  spot: string,
  title: string,
  uri: string,
  confidence: number,
  language: string,
  fetchedAt: string,
  languageConfidence: number,
};

export const storeFeeds = async (
  redisClient: RedisClient,
  entities: string | string[],
  urls: string | string[],
): Promise<void> => {
  // FIXME: Maybe validate urls?
  await Promise.all(
    (Array.isArray(entities) ? entities : [entities]).map((entity) =>
      addToSet(redisClient, `feeds:${entity}`, urls),
    ),
  );
};

export const fetchFeeds = async (
  redisClient: RedisClient,
  entity: string,
): Promise<string[]> => fetchSet(redisClient, `feeds:${entity}`);

export const publishEntities = async (
  redisClient: RedisClient,
  entities: string | string[],
): Promise<void> => {
  await Promise.all(
    (Array.isArray(entities) ? entities : [entities]).map((entity) =>
      publishToStream(redisClient, "entites", {entity}),
    ),
  );
};

export default {
  storeFeeds,
  fetchFeeds,
  publishEntities,
};
