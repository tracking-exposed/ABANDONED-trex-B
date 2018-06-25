// @flow
type SyncAsync<R> = Promise<R> | R;

export const runForeverUntil = async <T>(
  pred: (n: T) => SyncAsync<boolean> = () => Promise.resolve(false),
  fn: () => SyncAsync<T>,
): Promise<void> => {
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

export const runForever = <T>(fn: () => SyncAsync<T>): Promise<void> =>
  runForeverUntil(() => Promise.resolve(true), fn);
