// @flow
export const runForeverUntil = async (
  pred: (n: mixed) => Promise<boolean> = () => Promise.resolve(false),
  fn: () => Promise<mixed>,
): Promise<mixed> => {
  const iter = () =>
    new Promise(async (resolve, reject) => {
      let value;
      let run = true;
      try {
        value = await fn();
      } catch (err) {
        return reject(err);
      }
      try {
        run = await pred(value);
      } catch (err) {
        return reject(err);
      }
      if (!run) return resolve();
      return setTimeout(async () => resolve(iter()), 0);
    });

  return Promise.resolve(iter());
};

export const runForever = (fn: () => Promise<mixed>): Promise<mixed> =>
  runForeverUntil(() => Promise.resolve(true), fn);
