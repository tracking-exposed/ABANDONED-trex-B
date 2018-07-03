// @flow
import {basename} from "path";
import type RedisClient from "ioredis";
import {addToSet, fetchSet, publishToStream} from "./redis";
import {sanitize} from "./feeds";

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
  const prettyEntities = (Array.isArray(entities) ? entities : [entities]).map(
    (e) => e.toLowerCase(),
  );
  const prettyUrls = (Array.isArray(urls) ? urls : [urls]).map((u) =>
    sanitize(basename(u)),
  );

  // FIXME: Maybe validate urls?
  await Promise.all(
    prettyEntities.map((entity) =>
      addToSet(redisClient, `entities:${entity}`, prettyUrls),
    ),
  );
  await Promise.all(
    prettyUrls.map((url) =>
      addToSet(redisClient, `feeds:${url}`, prettyEntities),
    ),
  );
};

export const fetchFeeds = async (
  redisClient: RedisClient,
  entity: string,
): Promise<string[]> => fetchSet(redisClient, `entities:${entity}`);

export const fetchByFeed = async (
  redisClient: RedisClient,
  url: string,
): Promise<string[]> => fetchSet(redisClient, `feeds:${sanitize(url)}`);

export const publishEntities = async (
  redisClient: RedisClient,
  entities: string | string[],
): Promise<void> => {
  await Promise.all(
    (Array.isArray(entities) ? entities : [entities]).map((entity) =>
      publishToStream(redisClient, "entities", {entity}),
    ),
  );
};

export default {
  storeFeeds,
  fetchFeeds,
  fetchByFeed,
  publishEntities,
};
