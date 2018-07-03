import test from "ava";
import Chance from "chance";
import mockFs from "mock-fs";

import cli from "../src/cli";

const chance = new Chance();

test("cli processor-cli provides a default parameters", (t) => {
  cli()
    .exitProcess(false)
    .parse("", (err, defaults) => {
      t.is(defaults.redisHost, "localhost");
      t.is(defaults.redisPort, 6379);
      t.is(defaults.mongoHost, "localhost");
      t.is(defaults.mongoPort, 27017);
      t.is(defaults.mongoDb, "tracking-exposed");
      t.is(defaults.dataPath, "/tmp");
    });
});

test("cli processor-cli can set arguments through the environment", (t) => {
  const expectedHost = chance.string({length: 5});
  const expectedDb = chance.string({length: 5});
  const expectedPort = chance.natural();
  const expectedPath = chance.string({length: 5});
  process.env.TREX_REDIS_HOST = expectedHost;
  process.env.TREX_REDIS_PORT = expectedPort;
  process.env.TREX_MONGO_HOST = expectedHost;
  process.env.TREX_MONGO_PORT = expectedPort;
  process.env.TREX_MONGO_DB = expectedDb;
  process.env.TREX_DATA_PATH = expectedPath;

  cli()
    .exitProcess(false)
    .parse("", (err, defaults) => {
      t.is(defaults.redisHost, expectedHost);
      t.is(defaults.redisPort, expectedPort);
      t.is(defaults.mongoHost, expectedHost);
      t.is(defaults.mongoPort, expectedPort);
      t.is(defaults.mongoDb, expectedDb);
      t.is(defaults.dataPath, expectedPath);
    });
  [
    "REDIS_HOST",
    "REDIS_PORT",
    "MONGO_HOST",
    "MONGO_PORT",
    "MONGO_DB",
    "DATA_PATH",
  ].forEach((v) => delete process.env[`TREX_${v}`]);
});

test("cli processor-cli start needs options stream and processor", (t) => {
  cli()
    .exitProcess(false)
    .parse("start", (err) => {
      t.true(/Missing.*: stream.*processor/i.test(err.message));
    });
});

test("cli processor-cli start accepts the stream and a processor", (t) => {
  cli()
    .exitProcess(false)
    .parse("start -s s1 -p p1", (err, cfg) => {
      t.is(cfg.stream, "s1");
      t.is(cfg.processor, "p1");
    });
});

[".processorrc", ".processor.json"].forEach((file) =>
  test(`cli processor-cli start recognizes ${file} as a config file`, (t) => {
    mockFs({
      [file]: JSON.stringify({stream: "s1", processor: "p1"}),
    });
    cli()
      .exitProcess(false)
      .parse("start", (err, cfg) => {
        t.is(cfg.stream, "s1");
        t.is(cfg.processor, "p1");
      });
    mockFs.restore();
  }),
);
