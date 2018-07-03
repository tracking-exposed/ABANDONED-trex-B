import test from "ava";
import {toEntities} from "../src/utils";

test("utils toEntities extracts entities from an URL", (t) => {
  const url = "/feeds/entity.xml";
  const expected = ["entity"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("utils toEntities extracts multiple entities from an URL", (t) => {
  const url = "/feeds/entity+other+more.xml";
  const expected = ["entity", "other", "more"];
  const result = toEntities(url);
  t.deepEqual(result, expected);
});

test("utils toEntities returns an empty array for an invalid url", (t) => {
  const url = "/feeds/entity";
  const result = toEntities(url);
  t.deepEqual(result, []);
});
