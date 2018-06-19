import test from "ava";

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
