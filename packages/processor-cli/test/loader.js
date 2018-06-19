import test from "ava";
import path from "path";
import mock from "mock-require";

import {loader} from "../src";

test.afterEach(() => mock.stopAll());

test("throws an error if no package can be loaded", async (t) => {
  const loaded = loader("non-existing");
  const err = await t.throws(loaded);
  t.true(/non-existing/.test(err.message));
});

test("loads a processor from a relative path", async (t) => {
  mock(path.join(process.cwd(), "./mod"), () => 23);
  const mod = await loader("./mod");

  t.true(typeof mod === "function");
  t.is(mod(), 23);
});

test("loads a processor from an absolute path", async (t) => {
  mock("/mod", () => 23);
  const mod = await loader("/mod");

  t.true(typeof mod === "function");
  t.is(mod(), 23);
});

test("loads a processor from a module", async (t) => {
  mock("module", () => 23);
  const mod = await loader("module");
  t.true(typeof mod === "function");
  t.is(mod(), 23);
});
