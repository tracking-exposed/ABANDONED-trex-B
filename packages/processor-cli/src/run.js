// @flow
import cli from "./cli";
import loader from "./loader";
import {client, pollFromStream} from "./redis";
import {runForever} from "./loop";

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const redis = client();
  const processor = await loader(cfg.processor);

  runForever(async () => {
    const events = await pollFromStream(cfg.stream, redis);
    await Promise.all(events.map(processor));
  });
};
