// @flow
import differenceInMilliseconds from "date-fns/difference_in_milliseconds";

export const ageingMemoize = (
  fn: () => mixed,
  ex: number = 0,
): (() => mixed) => {
  let cache;
  let ts = new Date();
  return () => {
    const now = new Date();
    if (cache == null || differenceInMilliseconds(now, ts) > ex) {
      ts = new Date();
      cache = fn();
      return cache;
    }
    ts = now;
    return cache;
  };
};

export const envOr = (orVal: string, key: string) =>
  process.env[key] == null ? orVal : process.env[key];

export const env = (key: string) => envOr("", key);

export default {
  ageingMemoize,
  envOr,
  env,
};
