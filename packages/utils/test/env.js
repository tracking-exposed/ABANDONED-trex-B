/* eslint no-return-assign: off, no-param-reassign: off */
import test from "ava";
import Chance from "chance";

import {env, envOr} from "../src";

const chance = new Chance();

test("envOr returns the default value if the variable doesn't exist", (t) => {
  const defaultVal = chance.string({length: 5});
  const varName = chance.string({length: 5});

  const result = envOr(defaultVal, varName);

  t.is(result, defaultVal);

  delete process.env[varName];
});

test("envOr returns the value of an environment variable", (t) => {
  const val = chance.string({length: 5});
  const defaultVal = chance.string({length: 5});
  const varName = chance.string({length: 5});
  process.env[varName] = val;

  const result = envOr(defaultVal, varName);

  t.is(result, val);

  delete process.env[varName];
});

test("env returns the value of an environment variable", (t) => {
  const val = chance.string({length: 5});
  const varName = chance.string({length: 5});
  process.env[varName] = val;

  const result = env(varName);

  t.is(result, val);

  delete process.env[varName];
});

test("env returns an empty string for a non existing environment variable", (t) => {
  const varName = chance.string({length: 5});

  const result = env(varName);

  t.is(result, "");
});
