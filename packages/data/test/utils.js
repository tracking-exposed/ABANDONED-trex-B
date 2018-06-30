import test from "ava";
import {sha1} from "../src/utils";

test("utils sha1 generate hashes", (t) => {
  const expected = "0a4d55a8d778e5022fab701977c5d840bbc486d0";
  const result = sha1("Hello World");
  t.is(result, expected);
});
