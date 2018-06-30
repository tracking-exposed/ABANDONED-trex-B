// @flow
import {mkdir} from "fs";
import {dirname} from "path";
import {promisify} from "util";

export const mkdirP = (dir: string): Promise<void> =>
  promisify(mkdir)(dir).catch((err) => {
    switch (err.code) {
      case "EEXIST":
        return Promise.resolve();
      case "ENOENT":
        // eslint-disable-next-line promise/no-nesting
        return mkdirP(dirname(dir)).then(() => mkdirP(dir));
      default:
        throw err;
    }
  });

export default {
  mkdirP,
};
