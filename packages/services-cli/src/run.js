// @flow
import {registerShutdown, loadPkg} from "@tracking-exposed/utils";
import micro from "micro";

import cli from "./cli";

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  const service = await loadPkg(cfg.service);

  // eslint-disable-next-line no-console
  registerShutdown(() => console.log("Shutting down."));
  // eslint-disable-next-line no-console
  console.log("Starting to serve.");

  const server = micro(service(cfg));
  server.listen(cfg.port);
};
