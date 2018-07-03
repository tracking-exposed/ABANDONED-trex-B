/* eslint no-return-assign: off, no-param-reassign: off */
import test from "ava";
import Chance from "chance";
import mockFs from "mock-fs";

import cli from "../src/cli";

const chance = new Chance();

test("cli services-cli provides a default parameters", (t) => {
  cli()
    .exitProcess(false)
    .parse("", (err, defaults) => {
      t.is(defaults.redisHost, "localhost");
      t.is(defaults.redisPort, 6379);
      t.is(defaults.dataPath, "/tmp");
    });
});

test("cli services-cli can set arguments through the environment", (t) => {
  const expectedHost = chance.string({length: 5});
  const expectedPort = chance.natural();
  const expectedPath = chance.string({length: 5});
  process.env.TREX_REDIS_HOST = expectedHost;
  process.env.TREX_REDIS_PORT = expectedPort;
  process.env.TREX_DATA_PATH = expectedPath;

  cli()
    .exitProcess(false)
    .parse("", (err, defaults) => {
      t.is(defaults.redisHost, expectedHost);
      t.is(defaults.redisPort, expectedPort);
      t.is(defaults.dataPath, expectedPath);
    });
  ["REDIS_HOST", "REDIS_PORT", "DATA_PATH"].forEach(
    (v) => delete process.env[`TREX_${v}`],
  );
});

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
