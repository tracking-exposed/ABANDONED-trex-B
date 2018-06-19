import test from "ava";
import mockFs from "mock-fs";

import cli from "../src/cli";

test("`start` needs options stream and processor", (t) => {
  cli()
    .exitProcess(false)
    .parse("start", (err) => {
      t.true(/Missing.*: stream.*processor/i.test(err.message));
    });
});

test("`start` accepts the stream and a processor", (t) => {
  cli()
    .exitProcess(false)
    .parse("start -s s1 -p p1", (err, cfg) => {
      t.is(cfg.stream, "s1");
      t.is(cfg.processor, "p1");
    });
});

[".processorrc", ".processor.json"].forEach((file) =>
  test(`start recognizes ${file} as a config file`, (t) => {
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
