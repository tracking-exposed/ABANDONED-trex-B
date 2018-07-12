/* eslint no-console: off */
// @flow
const callerFile = () => {
  const originalFunc = Error.prepareStackTrace;

  let callerfile;
  try {
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    // $FlowFixMe
    const currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      // $FlowFixMe
      callerfile = err.stack.shift().getFileName();
      if (currentfile !== callerfile) break;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  Error.prepareStackTrace = originalFunc;

  return callerfile;
};

const withCaller = (fn: () => mixed) => {
  let caller;
  return (...args: mixed[]) => {
    const callee = callerFile();
    if (callee !== caller) {
      if (caller != null) console.groupEnd();
      caller = callee;
      console.group(caller);
    }
    return fn(...args);
  };
};

export const obj = (arg: mixed) =>
  console.dir(arg, {depth: null, colors: true});

export const error = withCaller((...args) => {
  console.error(...args);
});

export const info = withCaller((...args: mixed[]) => {
  const batched = args.reduce((memo, arg) => {
    if (typeof arg === "string") {
      const last = memo.slice(-1)[0];
      if (typeof last === "string")
        return memo.slice(0, -1).concat(`${last} ${arg}`);
    }
    return memo.concat(arg);
  }, []);
  batched.forEach(
    (msg) => (typeof msg === "string" ? console.log(msg) : obj(msg)),
  );
});

export const debug = info;

export const o = obj;
export const i = info;
export const d = debug;
export const er = error;

export default {obj, info, debug, error, o, i, d, er};
