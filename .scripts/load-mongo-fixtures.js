#!/usr/bin/env node
const path = require("path");
const dotenv = require("dotenv");
const {MongoClient} = require("mongodb");

const impressions = require(path.join(
  process.cwd(),
  "packages/data/test/fixtures/impressions",
));
const htmls = require(path.join(
  process.cwd(),
  "packages/data/test/fixtures/htmls",
));


dotenv.config();

const mongoHost = process.env.TREX_MONGO_HOST;
const mongoPort = process.env.TREX_MONGO_PORT;
const mongoDb = process.env.TREX_MONGO_DB;

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
