// @flow
import cli from "./cli";
import loader from "./loader";
import {client, pollFromStream} from "./redis";
import {runForever} from "./loop";

const registerShutdown = (fn: () => mixed): void => {
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

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const redis = client();
  const processor = await loader(cfg.processor);

  registerShutdown(() => console.log("Shutting down."));
  console.log("Starting to poll events.");

  runForever(async () => {
    const events = await pollFromStream(cfg.stream, redis);
    await Promise.all(events.map(processor));
  });
};
