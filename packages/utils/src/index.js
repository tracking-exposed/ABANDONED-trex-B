// @flow
export const envOr = (orVal: string, key: string) =>
  process.env[key] == null ? orVal : process.env[key];

export const env = (key: string) => envOr("", key);

export default {
  envOr,
  env,
};
