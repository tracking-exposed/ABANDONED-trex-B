import test from "ava";
import MockRedis from "ioredis-mock";

import {pollFromStream, publishToStream} from "../src/redis";

test("poll from a stream in a blocking manner", (t) => {
  const redis = new MockRedis();
  const op = pollFromStream("mystream", redis);
  return redis.xadd("mystream", "*", "key", "value").then((id) =>
    op.then((events) => {
      t.deepEqual(events, [{stream: "mystream", key: "value", id}]);
    }),
  );
});

test("push an event to a stream", (t) => {
  const redis = new MockRedis();
  return publishToStream("mystream", {key: "value"}, redis).then((id) => {
    t.deepEqual(redis.data.get("mystream"), [[id, ["key", "value"]]]);
  });
});
