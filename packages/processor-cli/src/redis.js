// @flow
import Redis from "ioredis";

export const client = (): Redis => {
  // $FlowFixMe
  const {string: xadd} = Redis.prototype.createBuiltinCommand("xadd");
  // $FlowFixMe
  const {string: xread} = Redis.prototype.createBuiltinCommand("xread");
  // $FlowFixMe
  Redis.prototype.xadd = xadd;
  // $FlowFixMe
  Redis.prototype.xread = xread;
  const redis = new Redis();
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

export const pollFromStream = async (stream: string, redis: Redis) => {
  // $FlowFixMe
  const data = await redis.xread("BLOCK", "0", "STREAMS", stream, "$");
  return data.reduce(
    (memo, [, events]) =>
      memo.concat(
        events.map(([id, values]) => {
          const obj = values
            .reduce((acc, arg, i) => {
              const chunk = Math.floor(i / 2);
              const tuple = acc[chunk] || [];
              // eslint-disable-next-line no-param-reassign
              acc[chunk] = tuple.concat(arg);
              return acc;
            }, [])
            .reduce(
              (acc, [key, value]) => Object.assign(acc, {[key]: value}),
              {},
            );
          return {stream, id, ...obj};
          // return acc.concat();
        }),
      ),
    [],
  );
};
