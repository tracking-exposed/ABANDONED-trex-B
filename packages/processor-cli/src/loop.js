// @flow
export const runForever = (fn: () => Promise<mixed>): Promise<mixed> => {
  const iter = () =>
    new Promise(async (resolve, reject) => {
      try {
        await fn();
      } catch (err) {
        return reject(err);
      }
      return setTimeout(() => resolve(iter()), 0);
    });

  return Promise.resolve(iter());
};

export const runForeverUntil = async (
  fn: () => Promise<mixed>,
  pred: (n: mixed) => Promise<boolean> = () => Promise.resolve(false),
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
