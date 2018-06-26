#!/usr/bin/env node
const path = require("path");
const dotenv = require("dotenv");
const {MongoClient} = require("mongodb");

const impressions = require(path.join(
  process.cwd(),
  "packages/processor-cli/test/fixtures/impressions",
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
  if (collections.length > 0) await db.dropCollection("impressions");
  await db.collection("impressions").insert(impressions);
  process.exit(0);
})();
