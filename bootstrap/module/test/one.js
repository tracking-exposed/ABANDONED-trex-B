import test from "ava";

import add from "../src";

test("first test", (t) => {
  t.is(add(1, 1), 2);
});
