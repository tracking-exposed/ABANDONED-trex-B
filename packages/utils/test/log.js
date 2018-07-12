/* eslint import/no-named-as-default-member: off */
import test from "ava";
import sinon from "sinon";

import utils from "../src";
import log from "../src/log";

test("utils log interface", (t) => {
  ["info", "i", "debug", "d", "error", "er", "obj", "o"].forEach((key) => {
    t.true(typeof log[key] === "function");
    t.true(typeof utils.log[key] === "function");
  });
});

test("utils log obj calls console.dir", (t) => {
  const stub = sinon.stub(console, "dir");
  const expected = {a: 23};

  log.obj(expected);
  log.o(expected);

  t.is(stub.callCount, 2);
  t.true(stub.firstCall.calledWith(expected));
  t.true(stub.secondCall.calledWith(expected));

  stub.restore();
});

test("utils log info calls console.log", (t) => {
  const stub = sinon.stub(console, "log");
  const groupStub = sinon.stub(console, "group");
  const groupEndStub = sinon.stub(console, "groupEnd");
  const expected = `This is a message.`;

  log.info(expected);
  log.i(expected);

  t.is(stub.callCount, 2);
  t.is(groupStub.callCount, 1);
  t.is(groupEndStub.callCount, 0);
  t.true(stub.firstCall.calledWithExactly(expected));
  t.true(stub.secondCall.calledWithExactly(expected));

  stub.restore();
  groupStub.restore();
  groupEndStub.restore();
});

test("utils log info batches string messages into one line", (t) => {
  const stub = sinon.stub(console, "log");
  const expected = "This is a message.".split(" ");

  log.info(...expected);
  log.i(...expected);

  t.is(stub.callCount, 2);
  t.true(stub.firstCall.calledWithExactly(expected.join(" ")));
  t.true(stub.secondCall.calledWithExactly(expected.join(" ")));

  stub.restore();
});

test("utils log info does the right thing with mixed types", (t) => {
  const logStub = sinon.stub(console, "log");
  const dirStub = sinon.stub(console, "dir");
  const args = ["This is", "a", {a: 23}, "message"];

  const logExpected = ["This is a", "message"];
  const dirExpected = [{a: 23}];

  log.info(...args);
  log.i(...args);

  t.is(logStub.callCount, 4);
  t.is(dirStub.callCount, 2);
  t.true(logStub.firstCall.calledWithExactly(logExpected[0]));
  t.true(logStub.secondCall.calledWithExactly(logExpected[1]));
  t.true(logStub.thirdCall.calledWithExactly(logExpected[0]));
  t.true(logStub.lastCall.calledWithExactly(logExpected[1]));

  t.true(dirStub.firstCall.calledWith(dirExpected[0]));
  t.true(dirStub.secondCall.calledWith(dirExpected[0]));

  logStub.restore();
  dirStub.restore();
});

test("utils log error calls messages with console.error", (t) => {
  const stub = sinon.stub(console, "error");
  const expected = "This is an error message.";

  log.error(expected);
  log.er(expected);

  t.is(stub.callCount, 2);
  t.true(stub.firstCall.calledWithExactly(expected));
  t.true(stub.secondCall.calledWithExactly(expected));

  stub.restore();
});

test("utils log debug mirrors log.info", (t) => {
  const stub = sinon.stub(console, "log");
  const expected = "This is a debug message.";

  log.debug(expected);
  log.d(expected);

  t.is(stub.callCount, 2);
  t.true(stub.firstCall.calledWithExactly(expected));
  t.true(stub.secondCall.calledWithExactly(expected));

  stub.restore();
});
test("utils log debug batches string messages into one line", (t) => {
  const stub = sinon.stub(console, "log");
  const expected = "This is a message.".split(" ");

  log.debug(...expected);
  log.d(...expected);

  t.is(stub.callCount, 2);
  t.true(stub.firstCall.calledWithExactly(expected.join(" ")));
  t.true(stub.secondCall.calledWithExactly(expected.join(" ")));

  stub.restore();
});

test("utils log debug does the right thing with mixed types", (t) => {
  const logStub = sinon.stub(console, "log");
  const dirStub = sinon.stub(console, "dir");
  const args = ["This is", "a", {a: 23}, "message"];

  const logExpected = ["This is a", "message"];
  const dirExpected = [{a: 23}];

  log.debug(...args);
  log.d(...args);

  t.is(logStub.callCount, 4);
  t.is(dirStub.callCount, 2);
  t.true(logStub.firstCall.calledWithExactly(logExpected[0]));
  t.true(logStub.secondCall.calledWithExactly(logExpected[1]));
  t.true(logStub.thirdCall.calledWithExactly(logExpected[0]));
  t.true(logStub.lastCall.calledWithExactly(logExpected[1]));

  t.true(dirStub.firstCall.calledWith(dirExpected[0]));
  t.true(dirStub.secondCall.calledWith(dirExpected[0]));

  logStub.restore();
  dirStub.restore();
});
