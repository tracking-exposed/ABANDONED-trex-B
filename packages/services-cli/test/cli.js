import test from "ava";
import mockFs from "mock-fs";

import cli from "../src/cli";

test("cli services-cli start needs option: service", (t) => {
  cli()
    .exitProcess(false)
    .parse("start", (err) => {
      t.true(/Missing.*: service/i.test(err.message));
    });
});

test("cli services-cli start accepts the service and port", (t) => {
  cli()
    .exitProcess(false)
    .parse("start -s service -p 667", (err, cfg) => {
      t.is(cfg.service, "service");
      t.is(cfg.port, 667);
    });
});

test("cli services-cli start has a default port", (t) => {
  cli()
    .exitProcess(false)
    .parse("start -s service", (err, cfg) => {
      t.is(cfg.port, 3000);
    });
});

[".servicesrc", ".services.json"].forEach((file) =>
  test(`cli services-cli start recognizes ${file} as a config file`, (t) => {
    mockFs({
      [file]: JSON.stringify({service: "service", port: 667}),
    });
    cli()
      .exitProcess(false)
      .parse("start", (err, cfg) => {
        t.is(cfg.service, "service");
        t.is(cfg.port, 667);
      });
    mockFs.restore();
  }),
);
