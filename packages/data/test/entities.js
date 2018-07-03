import test from "ava";
import Redis from "ioredis-mock";
import Chance from "chance";

import {storeFeeds, fetchFeeds} from "../src/entities";

const chance = new Chance();

test("entities storeFeeds adds a single feed to an entity", async (t) => {
  const redis = new Redis();
  const expected = chance.url();
  await storeFeeds(redis, "entity", expected);
  const result = redis.data.get("feeds:entity");
  t.deepEqual(result, new Set([expected]));
});

test("entities storeFeeds adds multiple feeds to an entity", async (t) => {
  const redis = new Redis();
  const expected = [chance.url(), chance.url()];
  await storeFeeds(redis, "entity", expected);
  const result = redis.data.get("feeds:entity");
  t.deepEqual(result, new Set(expected));
});

test("entities storeFeeds adds multiple feeds to multiple entities", async (t) => {
  const redis = new Redis();
  const entities = ["entity1", "entity2"];
  const expected = [chance.url(), chance.url()];
  await storeFeeds(redis, entities, expected);
  entities.forEach((entity) => {
    const result = redis.data.get(`feeds:${entity}`);
    t.deepEqual(result, new Set(expected));
  });
});

test("entities storeFeeds adds a single feed to multiple entities", async (t) => {
  const redis = new Redis();
  const entities = ["entity1", "entity2"];
  const expected = chance.url();
  await storeFeeds(redis, entities, expected);
  entities.forEach((entity) => {
    const result = redis.data.get(`feeds:${entity}`);
    t.deepEqual(result, new Set([expected]));
  });
});

test("entities fetchFeeds retrieves feed urls for an entity", async (t) => {
  const expected = [chance.url(), chance.url()];
  const redis = new Redis({data: {"feeds:entity": new Set(expected)}});

  const result = await fetchFeeds(redis, "entity");

  t.deepEqual(result, expected);
});

test("entities fetchFeeds retrieves an empty array if entity doesn't exist", async (t) => {
  const redis = new Redis();
  const result = await fetchFeeds(redis, "entity");
  t.deepEqual(result, []);
});
