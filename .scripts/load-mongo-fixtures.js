#!/usr/bin/env node
const path = require("path");
const {MongoClient} = require("mongodb");

const impressions = require(path.join(
  process.cwd(),
  "packages/data/test/fixtures/impressions",
));
const htmls = require(path.join(
  process.cwd(),
  "packages/data/test/fixtures/htmls",
));

const mongoHost = "localhost";
const mongoPort = 27017;
const mongoDb = "tracking-exposed";

const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`;

(async () => {
  const mongo = await MongoClient.connect(mongoUri);
  const db = mongo.db();
  const collections = await db.collections();
  if (collections.length > 0) {
    try {
      await db.dropCollection("impressions");
      await db.dropCollection("htmls");
    } catch (e) {}
  }
  await db.collection("impressions").insert(impressions);
  await db.collection("htmls").insert(htmls);
  process.exit(0);
})();
