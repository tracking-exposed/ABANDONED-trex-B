// @flow
import path from "path";
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

export const registerShutdown = (fn: () => mixed): void => {
  let run = false;
  const wrapper = () => {
    if (!run) {
      run = true;
      fn();
    }
  };
  process.on("SIGINT", () => {
    wrapper();
    process.exit(128);
  });
  process.on("SIGTERM", () => {
    wrapper();
    process.exit(128);
  });
  process.on("exit", wrapper);
};

export const loadPkg = (pkg: string): Promise<mixed> => {
  const loader = new Promise((resolve, reject) => {
    // If pkg is an absolute path, path,join automatically drops the path from
    // process.cwd().
    const pkgPath =
      pkg.startsWith("/") || pkg.startsWith("./")
        ? path.join(process.cwd(), pkg)
        : pkg;
    let mod;
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
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

export default {
  ageingMemoize,
  registerShutdown,
  loadPkg,
};
