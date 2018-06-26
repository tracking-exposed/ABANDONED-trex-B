import test from "ava";
import {MongoClient, MongoError} from "mongodb";
import MongodbMemoryServer from "mongodb-memory-server";

import {client, fetchImpression} from "../src/mongo";
import impressions from "./fixtures/impressions";

// eslint-disable-next-line no-param-reassign, no-return-assign
test.before((t) => (t.context.mongod = new MongodbMemoryServer()));

test.after.always((t) => t.context.mongod.stop());

test.serial("mongo client creates a connection", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await client(mongoUri);
  t.true(await mongo.isConnected());
});

test.serial("mongo client throws an error if it can't connect", async (t) => {
  const mongoUri = "mongodb://non-existent:0000/invalid";
  await t.throws(client(mongoUri), MongoError);
});

test.serial("fetch a single impression from mongo", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  mongo
    .db()
    .collection("impressions")
    .insert(impressions);
  const impression = await fetchImpression(mongo, impressions[0].id);
  const expected = impressions[0];
  t.deepEqual(impression, expected);
  mongo.db().dropCollection("impressions");
});

test.serial("fetch a non existing impression from mongo", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const impression = await fetchImpression(mongo, "non-existing");
  t.falsy(impression);
});
