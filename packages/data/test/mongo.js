import test from "ava";
import Chance from "chance";
import {MongoClient, MongoError} from "mongodb";
import MongodbMemoryServer from "mongodb-memory-server";

import {client, findOneBy, upsertOne} from "../src/mongo";

const chance = new Chance();

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

test.serial(
  "mongo findOneBy queries the database for a single record",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const collection = chance.hash();
    const expected = {id: chance.guid(), name: chance.name()};
    await mongo
      .db()
      .collection(collection)
      .insertOne(expected);

    const result = await findOneBy(mongo, collection, {
      id: expected.id,
    });

    t.deepEqual(result, expected);

    return mongo.db().dropCollection(collection);
  },
);

test.serial(
  "mongo findOneBy returns null for a non existing record",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const collection = chance.hash();
    // Create the collection by inserting at least one document.
    await mongo
      .db()
      .collection(collection)
      .insertOne({id: chance.guid()});

    const result = await findOneBy(mongo, collection, {
      id: chance.guid(),
    });

    t.true(result == null);

    return mongo.db().dropCollection(collection);
  },
);

test.serial("mongo upsertOne creates a new record", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const collection = chance.hash();
  const expected = {id: chance.guid(), name: chance.name()};

  await upsertOne(
    mongo,
    collection,
    {
      id: expected.id,
    },
    expected,
  );

  const {_id, ...result} = await mongo
    .db()
    .collection(collection)
    .findOne({id: expected.id});

  t.deepEqual(result, expected);

  return mongo.db().dropCollection(collection);
});

test.serial("mongo upsertOne updates an existing record", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const collection = chance.hash();
  const initial = {id: chance.guid(), name: chance.name()};
  const expected = Object.assign({}, initial, {name: chance.name()});

  await mongo
    .db()
    .collection(collection)
    .insert(initial);

  await upsertOne(
    mongo,
    collection,
    {
      id: initial.id,
    },
    expected,
  );

  const {_id, ...result} = await mongo
    .db()
    .collection(collection)
    .findOne({id: expected.id});

  t.deepEqual(result, expected);

  return mongo.db().dropCollection(collection);
});
