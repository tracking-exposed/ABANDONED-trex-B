// @flow
import cli from "./cli";
import loader from "./loader";

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const processor = await loader(cfg.processor);
  processor();
};
