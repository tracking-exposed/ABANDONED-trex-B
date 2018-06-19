// @flow
/* eslint global-require: off, import/no-dynamic-require: off */
import path from "path";

export default (pkg: string): Promise<() => mixed> => {
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
      return reject(new Error(`Failed to load the module at ${pkgPath}.`));
    }
    return resolve(mod);
  });
  return loader;
};
