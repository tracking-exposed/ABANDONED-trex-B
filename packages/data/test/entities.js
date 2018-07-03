import test from "ava";
import {basename} from "path";
import Redis from "ioredis-mock";
import Chance from "chance";

import {storeFeeds, fetchFeeds, fetchByFeed} from "../src/entities";

const chance = new Chance();

test("entities storeFeeds adds a single feed to a single entity", async (t) => {
  const redis = new Redis();
  const expectedEntity = chance.string();
  const expectedFeed = chance.url();
  const expectedEntityBase = expectedEntity.toLowerCase();
  const expectedFeedBase = basename(expectedFeed);

  await storeFeeds(redis, expectedEntity, expectedFeed);

  const resultEntities = redis.data.get(`entities:${expectedEntityBase}`);
  const resultFeeds = redis.data.get(`feeds:${expectedFeedBase}`);

  t.deepEqual(resultEntities, new Set([expectedFeedBase]));
  t.deepEqual(resultFeeds, new Set([expectedEntityBase]));
});

test("entities storeFeeds adds multiple feeds to a single entity", async (t) => {
  const redis = new Redis();
  const expectedEntity = chance.string();
  const expectedFeeds = [chance.url(), chance.url()];
  const expectedEntityBase = expectedEntity.toLowerCase();
  const expectedFeedsBase = expectedFeeds.map((f) => basename(f));

  await storeFeeds(redis, expectedEntity, expectedFeeds);

  const resultEntities = redis.data.get(`entities:${expectedEntityBase}`);
  expectedFeedsBase.forEach((feed) => {
    const resultFeeds = redis.data.get(`feeds:${feed}`);

    t.deepEqual(resultEntities, new Set(expectedFeedsBase));
    t.deepEqual(resultFeeds, new Set([expectedEntityBase]));
  });
});

test("entities storeFeeds adds multiple feeds to multiple entities", async (t) => {
  const redis = new Redis();
  const expectedEntities = [chance.string(), chance.string()];
  const expectedFeeds = [chance.url(), chance.url()];
  const expectedEntitiesBase = expectedEntities.map((e) => e.toLowerCase());
  const expectedFeedsBase = expectedFeeds.map((f) => basename(f));

  await storeFeeds(redis, expectedEntities, expectedFeeds);

  expectedEntitiesBase.forEach((entity) => {
    const resultEntities = redis.data.get(`entities:${entity}`);
    expectedFeedsBase.forEach((feed) => {
      const resultFeeds = redis.data.get(`feeds:${feed}`);

      t.deepEqual(resultEntities, new Set(expectedFeedsBase));
      t.deepEqual(resultFeeds, new Set(expectedEntitiesBase));
    });
  });
});

test("entities storeFeeds adds a single feed to multiple entities", async (t) => {
  const redis = new Redis();
  const expectedEntities = [chance.string(), chance.string()];
  const expectedFeed = chance.url();
  const expectedFeedBase = basename(expectedFeed);
  const expectedEntitiesBase = expectedEntities.map((e) => e.toLowerCase());

  await storeFeeds(redis, expectedEntities, expectedFeed);

  const resultFeeds = redis.data.get(`feeds:${expectedFeedBase}`);
  expectedEntitiesBase.forEach((entity) => {
    const resultEntities = redis.data.get(`entities:${entity}`);

    t.deepEqual(resultEntities, new Set([expectedFeedBase]));
    t.deepEqual(resultFeeds, new Set(expectedEntitiesBase));
  });
});

test("entities fetchFeeds retrieves feed urls for an entity", async (t) => {
  const entity = chance.string();
  const expected = [chance.url(), chance.url()];
  const redis = new Redis({data: {[`entities:${entity}`]: new Set(expected)}});

  const result = await fetchFeeds(redis, entity);

  t.deepEqual(result, expected);
});

test("entities fetchFeeds retrieves an empty array if entity doesn't exist", async (t) => {
  const redis = new Redis();
  const result = await fetchFeeds(redis, "entity");
  t.deepEqual(result, []);
});

test("entities fetchByFeed retrieves entities for a given feed url", async (t) => {
  const url = basename(chance.url());
  const expected = [chance.string(), chance.string()];
  const redis = new Redis({data: {[`feeds:${url}`]: new Set(expected)}});

  const result = await fetchByFeed(redis, url);

  t.deepEqual(result, expected);
});

test("entities fetchByFeed retrieves an empty array if feed doesn't exist", async (t) => {
  const redis = new Redis();
  const result = await fetchByFeed(redis, "feed");
  t.deepEqual(result, []);
});
