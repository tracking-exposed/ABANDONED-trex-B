import test from "ava";
import MockRedis from "ioredis-mock";

import {pollFromStream, publishToStream} from "../src/redis";

test("poll from a stream in a blocking manner", async (t) => {
  const redis = new MockRedis();
  const op = pollFromStream("mystream", redis);

  const id = await redis.xadd("mystream", "*", "key", "value");
  const events = await op;

  t.deepEqual(events, [{stream: "mystream", key: "value", id}]);
});

test("push an event to a stream", async (t) => {
  const redis = new MockRedis();

  const id = await publishToStream("mystream", {key: "value"}, redis);

  t.deepEqual(redis.data.get("mystream"), [[id, ["key", "value"]]]);
});
