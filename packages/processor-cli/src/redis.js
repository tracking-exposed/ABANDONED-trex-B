// @flow
import Redis from "ioredis";

// export type StreamRedis = Redis & {
//   xadd: (stream: string, id: string, ...args: mixed[]) => void,
// };

export const client = (): Redis => {
  // $FlowFixMe
  const {string: xadd} = Redis.prototype.createBuiltinCommand("xadd");
  // $FlowFixMe
  Redis.prototype.xadd = xadd;
  const redis = new Redis();
  // redis.xadd = xadd;
  return redis;
};

export const publishToStream = (
  stream: string,
  data: {[string]: mixed},
  redis: Redis,
) => {
  const args = Object.keys(data).reduce(
    (memo, key) => memo.concat([key, data[key]]),
    [],
  );
  // $FlowFixMe
  return redis.xadd(stream, "*", ...args);
};
