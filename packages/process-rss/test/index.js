import test from "ava";

import processor from "../src";

test("process-rss processor placeholder test", (t) => {
  t.is(typeof processor, "function");
});
