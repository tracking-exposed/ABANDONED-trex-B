import test from "ava";
import sinon from "sinon";
import fs from "fs";
import path from "path";
import mockFs from "mock-fs";

import {mkdirP} from "../src";

test("utils mkdirP creates recursively directories", async (t) => {
  mockFs({});
  const dir = path.join(process.cwd(), "some/path/to/dir");
  await mkdirP(dir);
  t.true(fs.statSync(dir).isDirectory());
  mockFs.restore();
});

test("utils mkdirP accepts existing directory paths", async (t) => {
  const dir = path.join(process.cwd(), "some/path/to/dir");
  mockFs({[dir]: {}});
  t.true(fs.statSync(dir).isDirectory());
  await mkdirP(dir);
  t.true(fs.statSync(dir).isDirectory());
  mockFs.restore();
});

test("utils mkdirP throws on any other error", async (t) => {
  const stub = sinon.stub(fs, "mkdir").throws(new Error("Boom!"));
  const error = await t.throws(() => mkdirP("/some/path"));
  t.is("Boom!", error.message);
  stub.restore();
});
