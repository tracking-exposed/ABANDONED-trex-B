import test from "ava";
import MockRedis from "ioredis-mock";

import {
  fromEvent,
  toEvent,
  client,
  pollFromStream,
  publishToStream,
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
