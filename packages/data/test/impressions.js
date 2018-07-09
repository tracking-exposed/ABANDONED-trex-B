import test from "ava";
import Chance from "chance";
import xml2js from "xml2js";
import {MongoClient} from "mongodb";
import MongodbMemoryServer from "mongodb-memory-server";

import {
  fetch,
  store,
  addEntities,
  fetchByEntities,
  toRss,
} from "../src/impressions";
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
      .collection("impressions2")
      .insert(impressions.map((o) => Object.assign({}, o))),
    mongo
      .db()
      .collection("htmls2")
      .insert(htmls.map((o) => Object.assign({}, o))),
  ]);
});

test.afterEach.always(async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  return Promise.all([
    mongo.db().dropCollection("impressions2"),
    mongo.db().dropCollection("htmls2"),
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
    .collection("impressions2")
    .findOne({id: expected.id}, {projection: {_id: 0}});
  const html = await mongo
    .db()
    .collection("htmls2")
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
    .collection("impressions2")
    .insertOne(Object.assign({}, impression));
  await mongo
    .db()
    .collection("htmls2")
    .insertOne(Object.assign({}, html));

  const expectedImpression = Object.assign({}, impression, {xx: chance.guid()});
  const expectedHtml = Object.assign({}, html, {xx: chance.guid()});

  await store(
    mongo,
    Object.assign({}, expectedImpression, {html: expectedHtml}),
  );

  const resultImpression = await mongo
    .db()
    .collection("impressions2")
    .findOne({id: impression.id}, {projection: {_id: 0}});
  const resultHtml = await mongo
    .db()
    .collection("htmls2")
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
      .collection("impressions2")
      .findOne({id: impression.id}, {projection: {_id: 0}});

    t.deepEqual(result, expected);
  },
);

test.serial("impressions addEntities appends a new entity", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  await addEntities(mongo, impressions[0].id, ["one", "two"]);

  const result = await mongo
    .db()
    .collection("impressions2")
    .findOne({id: impressions[0].id}, {projection: {_id: 0}});

  t.true(result.entities.includes("one"));
  t.true(result.entities.includes("two"));
});

test.serial(
  "impressions fetchByEntities fetches records by a single entity",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    await mongo
      .db()
      .collection("impressions2")
      .update({id: impressions[0].id}, {entities: ["one", "two"]});

    const results = await fetchByEntities(mongo, "one");

    results.forEach((r) => t.true(r.entities.includes("one")));
  },
);

test.serial(
  "impressions fetchByEntities fetches records by multiple entities",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const records = [
      {id: chance.guid(), htmlId: chance.guid(), entities: ["one"]},
      {id: chance.guid(), htmlId: chance.guid(), entities: ["one", "two"]},
      {
        id: chance.guid(),
        htmlId: chance.guid(),
        entities: ["one", "two", "three"],
      },
      {id: chance.guid(), htmlId: chance.guid(), entities: ["two", "three"]},
      {id: chance.guid(), htmlId: chance.guid(), entities: ["three"]},
    ];
    await mongo
      .db()
      .collection("impressions2")
      .insert(records);

    const results = await fetchByEntities(mongo, ["one", "two"]);

    results.forEach((r) =>
      t.true(r.entities.includes("one") && r.entities.includes("two")),
    );
  },
);

test.serial("impressions toRss creates an RSS XML", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const item = await fetch(mongo, impressions[0].id);
  const feed = toRss("feed.xml", {}, [item]);
  xml2js.parseString(feed, (err, result) => {
    t.falsy(err);
    const {channel} = result.rss;
    const [feedItem] = channel[0].item;
    t.true(Object.keys(result.rss.$).includes("xmlns:atom"));
    t.is(channel.length, 1);
    t.true(Object.keys(channel[0]).includes("title"));
    t.true(Object.keys(channel[0]).includes("description"));
    t.true(Object.keys(channel[0]).includes("link"));
    t.is(channel[0].item.length, 1);
    t.true(Object.keys(feedItem).includes("title"));
    t.true(Object.keys(feedItem).includes("description"));
    t.true(Object.keys(feedItem).includes("link"));
    t.true(Object.keys(feedItem).includes("guid"));
  });
});
