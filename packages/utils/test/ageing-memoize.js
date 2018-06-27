import test from "ava";
import sinon from "sinon";

import {ageingMemoize} from "../src";

const result = Symbol("result");

// eslint-disable-next-line no-param-reassign, no-return-assign
test.before((t) => (t.context.clock = sinon.useFakeTimers()));
test.after.always((t) => t.context.clock.restore());

test.serial("ageingMemoize memorizes a function call", (t) => {
  const stub = sinon.stub().returns(result);
  const f = ageingMemoize(stub);
  const a = f();
  const b = f();
  t.is(stub.callCount, 1);
  t.is(a, result);
  t.is(b, result);
});

test.serial(
  "ageingMemoize memoizes a promise returning function call",
  async (t) => {
    const stub = sinon.stub().resolves(result);
    const f = ageingMemoize(stub);
    const a = await f();
    const b = await f();
    t.is(stub.callCount, 1);
    t.is(a, result);
    t.is(b, result);
  },
);

test.serial("ageingMemoize expires a memoized function call", (t) => {
  const stub = sinon.stub().returns(result);
  const f = ageingMemoize(stub, 1000);
  const a = f();
  t.context.clock.tick(600);
  const b = f();
  t.context.clock.tick(1001);
  const c = f();
  t.is(stub.callCount, 2);
  t.is(a, result);
  t.is(b, result);
  t.is(c, result);
});

test.serial(
  "ageingMemoize expires a memoized promise returning function call",
  async (t) => {
    const stub = sinon.stub().returns(result);
    const f = ageingMemoize(stub, 1000);
    const a = await f();
    t.context.clock.tick(600);
    const b = await f();
    t.context.clock.tick(1001);
    const c = await f();
    t.is(stub.callCount, 2);
    t.is(a, result);
    t.is(b, result);
    t.is(c, result);
  },
);
