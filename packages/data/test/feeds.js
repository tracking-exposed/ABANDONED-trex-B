import test from "ava";

import {toEntities, toUrl, sanitize} from "../src/feeds";

test("feeds toEntities breaks a feed url into it's entity components and orders them", (t) => {
  const url = "a+c+b.xml";
  const expected = ["a", "b", "c"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("feeds toEntities can handle single entity urls", (t) => {
  const url = "a.xml";
  const expected = ["a"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("feeds toEntities removes duplicate elements", (t) => {
  const url = "a+a.xml";
  const expected = ["a"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("feeds toEntities accepts full URL strings as input", (t) => {
  const url = "http://host:1234/path/to/a.xml";
  const expected = ["a"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("feeds toEntities returns no entities for invalid URLs", (t) => {
  const url = "http://host:1234/path/to/a";
  const result = toEntities(url);
  t.deepEqual(result, []);
});

test("feeds toEntities decodes url components", (t) => {
  const url = "%D7%90%D7%95%D7%91%D7%9E%D7%94+elon%20musk.xml";
  const expected = ["elon musk", "אובמה"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("feeds toUrl sorts and joins entities into an url", (t) => {
  const entities = ["a", "c", "b"];
  const expected = "a+b+c.xml";
  const result = toUrl(entities);
  t.deepEqual(result, expected);
});

test("feeds toUrl removes duplicate elements", (t) => {
  const entities = ["a", "a"];
  const expected = "a.xml";
  const result = toUrl(entities);
  t.deepEqual(result, expected);
});

test("feeds toUrl throws if the entities array is empty", (t) => {
  const entities = [];
  t.throws(() => toUrl(entities));
});

test("feeds sanitize sorts the elements of a feed url", (t) => {
  const url = "a+c+b.xml";
  const expected = "a+b+c.xml";
  const result = sanitize(url);
  t.is(result, expected);
});

test("feeds sanitize removes duplicate elements", (t) => {
  const url = "a+a.xml";
  const expected = "a.xml";
  const result = sanitize(url);
  t.is(result, expected);
});
