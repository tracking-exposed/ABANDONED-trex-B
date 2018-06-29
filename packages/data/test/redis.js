import test from "ava";
import MockRedis from "ioredis-mock";

import {
  fromEvent,
  toEvent,
  client,
  pollFromStream,
  publishToStream,
  addToSet,
  fetchSet,
} from "../src/redis";

test("redis converts event data to an object", (t) => {
  const data = ["key", "value", "key1", "value1"];
  const expected = {key: "value", key1: "value1"};
  const result = fromEvent(data);
  t.deepEqual(result, expected);
});

test("redis converts an object to event data", (t) => {
  const data = {key: "value", key1: "value1"};
  const expected = ["key", "value", "key1", "value1"];
  const result = toEvent(data);
  t.deepEqual(result, expected);
});

test("redis client implements the stream API", (t) => {
  const redisClient = client("localhost", 6379);
  t.true(typeof redisClient.xadd === "function");
  t.true(typeof redisClient.xread === "function");
});

test("poll for next event in a blocking manner", async (t) => {
  const redis = new MockRedis();
  const op = pollFromStream(redis, "mystream", "$");

  const id = await redis.xadd("mystream", "*", "key", "value");
  const events = await op;

  t.deepEqual(events, [{stream: "mystream", key: "value", id}]);
});

test("poll for event since id in a blocking manner", async (t) => {
  const redis = new MockRedis();
  const op = pollFromStream(redis, "mystream", "3-0");

  await redis.xadd("mystream", "*", "key", "value");
  await redis.xadd("mystream", "*", "key", "value");
  const id = await redis.xadd("mystream", "*", "key", "value");
  const events = await op;

  t.deepEqual(events, [{stream: "mystream", key: "value", id}]);
});

test("push an event to a stream", async (t) => {
  const redis = new MockRedis();

  const id = await publishToStream(redis, "mystream", {key: "value"});

  t.deepEqual(redis.data.get("mystream"), [[id, ["key", "value"]]]);
});

test("redis addToSet adds a single member to a set", async (t) => {
  const redis = new MockRedis();

  const expected = "one";
  await addToSet(redis, "myset", expected);

  t.deepEqual(redis.data.get("myset"), new Set([expected]));
  t.is(redis.data.get("myset").size, 1);
});

test("redis addToSet adds multiple members to a set", async (t) => {
  const redis = new MockRedis();

  const expected = ["one", "two"];
  await addToSet(redis, "myset", expected);

  t.deepEqual(redis.data.get("myset"), new Set(expected));
  t.is(redis.data.get("myset").size, 2);
});

test("redis addToSet should not add duplicates", async (t) => {
  const expected = ["one", "two"];
  const redis = new MockRedis({
    data: {
      myset: new Set(expected),
    },
  });

  await addToSet(redis, "myset", ["one"]);

  t.deepEqual(redis.data.get("myset"), new Set(expected));
  t.is(redis.data.get("myset").size, 2);
});

test("redis fetchSet retrieves a set", async (t) => {
  const expected = ["one", "two"];
  const redis = new MockRedis({
    data: {
      myset: new Set(expected),
    },
  });

  const result = await fetchSet(redis, "myset");

  t.deepEqual(result, expected);
});

test("redis fetchSet retrieves an empty list if set doesn't exist", async (t) => {
  const redis = new MockRedis();
  const result = await fetchSet(redis, "myset");
  t.deepEqual(result, []);
});
