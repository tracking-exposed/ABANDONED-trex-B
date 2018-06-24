import test from "ava";
import sinon from "sinon";

import {runForever, runForeverUntil} from "../src/loop";

const ERR = Symbol("error");
const identity = (val) => val;

test("loop a promise returning function until an error is thrown", async (t) => {
  const fn = sinon.stub();
  fn.onFirstCall()
    .resolves()
    .onSecondCall()
    .resolves()
    .onThirdCall()
    .rejects(ERR);

  try {
    await runForever(fn);
  } catch (err) {
    t.is(fn.callCount, 3);
    t.is(err, ERR);
  }
});

test("loop a promise returning function until a predicate holds", async (t) => {
  const pred = sinon.spy(identity);
  const fn = sinon
    .stub()
    .onFirstCall()
    .resolves(true)
    .onSecondCall()
    .resolves(false);

  await runForeverUntil(fn, pred);

  t.is(pred.callCount, 2);
  t.is(fn.callCount, 2);
});

test("loop a promise returning function until a predicate holds catches errors", async (t) => {
  const pred = sinon.spy(identity);
  const fn = sinon
    .stub()
    .onFirstCall()
    .resolves(true)
    .onSecondCall()
    .rejects(ERR);

  try {
    await runForeverUntil(fn, pred);
  } catch (err) {
    t.is(pred.callCount, 1);
    t.is(fn.callCount, 2);
    t.is(err, ERR);
  }
});

test("loop a promise returning function until a predicate holds catches errors in the predicate", async (t) => {
  const pred = sinon
    .stub()
    .onFirstCall()
    .rejects(ERR);
  const fn = sinon.stub().resolves(true);

  try {
    await runForeverUntil(fn, pred);
  } catch (err) {
    t.is(pred.callCount, 1);
    t.is(fn.callCount, 1);
    t.is(err, ERR);
  }
});
