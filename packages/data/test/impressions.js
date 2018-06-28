import test from "ava";
import Chance from "chance";
import {MongoClient} from "mongodb";
import MongodbMemoryServer from "mongodb-memory-server";

import {fetch, store} from "../src/impressions";
import impressions from "./fixtures/impressions";
import htmls from "./fixtures/htmls";

const chance = new Chance();

// eslint-disable-next-line no-param-reassign, no-return-assign
test.before((t) => (t.context.mongod = new MongodbMemoryServer()));

test.after.always((t) => t.context.mongod.stop());

test.beforeEach(async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  return Promise.all([
    mongo
      .db()
      .collection("impressions")
      .insert(impressions.map((o) => Object.assign({}, o))),
    mongo
      .db()
      .collection("htmls")
      .insert(htmls.map((o) => Object.assign({}, o))),
  ]);
});

test.afterEach.always(async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  return Promise.all([
    mongo.db().dropCollection("impressions"),
    mongo.db().dropCollection("htmls"),
  ]);
});

test.serial("impressions fetch retrieves a single impression", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const expected = Object.assign({}, impressions[0], {html: htmls[0]});
  const result = await fetch(mongo, expected.id);
  t.deepEqual(result, expected);
});

test.serial(
  "impressions fetch retrieving a non existing impression returns null",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const expected = await fetch(mongo, "non-existing");
    t.true(expected == null);
  },
);

test.serial("impressions store creates a new impression", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const htmlId = chance.guid();

  const expected = {id: chance.guid(), htmlId, html: {id: htmlId}};

  await store(mongo, expected);

  const impression = await mongo
    .db()
    .collection("impressions")
    .findOne({id: expected.id}, {projection: {_id: 0}});
  const html = await mongo
    .db()
    .collection("htmls")
    .findOne({id: expected.htmlId}, {projection: {_id: 0}});
  const result = Object.assign({}, impression, {html});

  t.deepEqual(result, expected);
});

test.serial("impressions store updates an existing impression", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const htmlId = chance.guid();
  const impression = {id: chance.guid(), htmlId};
  const html = {id: htmlId};

  await mongo
    .db()
    .collection("impressions")
    .insertOne(Object.assign({}, impression));
  await mongo
    .db()
    .collection("htmls")
    .insertOne(Object.assign({}, html));

  const expectedImpression = Object.assign({}, impression, {xx: chance.guid()});
  const expectedHtml = Object.assign({}, html, {xx: chance.guid()});

  await store(
    mongo,
    Object.assign({}, expectedImpression, {html: expectedHtml}),
  );

  const resultImpression = await mongo
    .db()
    .collection("impressions")
    .findOne({id: impression.id}, {projection: {_id: 0}});
  const resultHtml = await mongo
    .db()
    .collection("htmls")
    .findOne({id: html.id}, {projection: {_id: 0}});

  t.deepEqual(resultImpression, expectedImpression);
  t.deepEqual(resultHtml, expectedHtml);
});

test.serial(
  "impressions store doesn't save html in the same collection",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);

    const expected = {id: chance.guid(), timelineId: chance.guid()};

    const impression = Object.assign({}, expected, {html: {id: chance.guid()}});
    await store(mongo, impression);

    const result = await mongo
      .db()
      .collection("impressions")
      .findOne({id: impression.id}, {projection: {_id: 0}});

    t.deepEqual(result, expected);
  },
);
