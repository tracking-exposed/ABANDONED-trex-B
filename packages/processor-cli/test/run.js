import test from "ava";

import run from "../src/run";

test("processor-cli run placeholder test", (t) => {
  t.is(typeof run, "function");
});
