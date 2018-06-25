// @flow
/* eslint global-require: off, import/no-dynamic-require: off */
import path from "path";

import type {StreamProcessor} from "./types";

export default (pkg: string): Promise<StreamProcessor> => {
  const loader = new Promise((resolve, reject) => {
    // If pkg is an absolute path, path,join automatically drops the path from
    // process.cwd().
    const pkgPath =
      pkg.startsWith("/") || pkg.startsWith("./")
        ? path.join(process.cwd(), pkg)
        : pkg;
    let mod;
    try {
      // $FlowFixMe
      mod = require(pkgPath);
    } catch (e) {
      const reason = new Error(`Failed to load the module at ${pkgPath}.`);
      reason.stack += `\nCaused By:\n${e.stack}`;
      return reject(reason);
    }
    return resolve(mod.default ? mod.default : mod);
  });
  return loader;
};
