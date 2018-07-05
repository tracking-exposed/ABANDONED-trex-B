import test from "ava";
import sinon from "sinon";
import proxyquire from "proxyquire";
import Chance from "chance";
import {MongoClient, MongoError} from "mongodb";
import MongodbMemoryServer from "mongodb-memory-server";

import {
  client,
  findOneBy,
  upsertOne,
  addToSet,
  findByMember,
} from "../src/mongo";

const chance = new Chance();

// eslint-disable-next-line no-param-reassign, no-return-assign
test.before((t) => (t.context.mongod = new MongodbMemoryServer()));

test.after.always((t) => t.context.mongod.stop());

test.serial("mongo client creates a connection", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await client(mongoUri);
  t.true(await mongo.isConnected());
  await client.reset();
});

test.serial("mongo client throws an error if it can't connect", async (t) => {
  const mongoUri = "mongodb://non-existent:0000/invalid";
  await t.throws(client(mongoUri), MongoError);
});

test.serial(
  "mongo client returns a single client connection across multiple calls",
  async (t) => {
    const stub = sinon.stub().resolves(23);
    const mongo = proxyquire("../src/mongo", {
      mongodb: {MongoClient: {connect: stub}},
    });
    const mongoUri = await t.context.mongod.getConnectionString();

    await mongo.client(mongoUri);
    await mongo.client(mongoUri);
    t.is(stub.callCount, 1);
  },
);

test.serial(
  "mongo client can reset and close existing connections",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await client(mongoUri);
    t.true(await mongo.isConnected());
    await client.reset();
    // Resetting a disconnected connection simply returns
    await client.reset();
    t.false(await mongo.isConnected());
  },
);

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
      .insertOne(Object.assign({}, expected));

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

test.serial("mongo findOneBy strips the _id field", async (t) => {
  const mongoUri = await t.context.mongod.getConnectionString();
  const mongo = await MongoClient.connect(mongoUri);
  const collection = chance.hash();
  const expected = {id: chance.guid(), name: chance.name()};
  await mongo
    .db()
    .collection(collection)
    .insertOne(Object.assign({}, expected));

  const result = await findOneBy(mongo, collection, {
    id: expected.id,
  });

  t.false("_id" in result);

  return mongo.db().dropCollection(collection);
});

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

  const result = await mongo
    .db()
    .collection(collection)
    .findOne({id: expected.id}, {projection: {_id: 0}});

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
    .insert(Object.assign({}, initial));

  await upsertOne(
    mongo,
    collection,
    {
      id: initial.id,
    },
    expected,
  );

  const result = await mongo
    .db()
    .collection(collection)
    .findOne({id: expected.id}, {projection: {_id: 0}});

  t.deepEqual(result, expected);

  return mongo.db().dropCollection(collection);
});

test.serial(
  "mongo addToSet adds a single element to a set of a record",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const collection = chance.hash();
    const initial = {id: chance.guid(), field: ["one", "two"]};

    await mongo
      .db()
      .collection(collection)
      .insert(Object.assign({}, initial));

    await addToSet(mongo, collection, {id: initial.id}, "field", "three");

    const expected = Object.assign({}, initial, {
      field: ["one", "two", "three"],
    });

    const result = await mongo
      .db()
      .collection(collection)
      .findOne({id: initial.id}, {projection: {_id: 0}});

    t.deepEqual(result, expected);

    return mongo.db().dropCollection(collection);
  },
);

test.serial(
  "mongo addToSet adds multiple elements to a set of a record",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const collection = chance.hash();
    const initial = {id: chance.guid(), field: ["one", "two"]};

    await mongo
      .db()
      .collection(collection)
      .insert(Object.assign({}, initial));

    await addToSet(mongo, collection, {id: initial.id}, "field", [
      "two",
      "three",
      "four",
    ]);

    const expected = Object.assign({}, initial, {
      field: ["one", "two", "three", "four"],
    });

    const result = await mongo
      .db()
      .collection(collection)
      .findOne({id: initial.id}, {projection: {_id: 0}});

    t.deepEqual(result, expected);

    return mongo.db().dropCollection(collection);
  },
);

test.serial(
  "mongo findByMember returns all records that includes a single element in an array field",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const collection = chance.hash();
    const records = [
      {id: chance.guid(), field: ["one"]},
      {id: chance.guid(), field: ["one", "two"]},
      {id: chance.guid(), field: ["two", "three"]},
      {id: chance.guid(), field: ["three", "four"]},
    ];
    await mongo
      .db()
      .collection(collection)
      .insert(records);

    const expected = records.slice(1, 3);
    const result = await findByMember(mongo, collection, "field", "two");

    t.deepEqual(result, expected);

    return mongo.db().dropCollection(collection);
  },
);

test.serial(
  "mongo findByMember returns all records that includes multiple elements in an array field",
  async (t) => {
    const mongoUri = await t.context.mongod.getConnectionString();
    const mongo = await MongoClient.connect(mongoUri);
    const collection = chance.hash();
    const records = [
      {id: chance.guid(), field: ["one"]},
      {id: chance.guid(), field: ["one", "two"]},
      {id: chance.guid(), field: ["two", "three"]},
      {id: chance.guid(), field: ["three", "four"]},
    ];
    await mongo
      .db()
      .collection(collection)
      .insert(records);

    const expected = records.slice(2, 3);
    const result = await findByMember(mongo, collection, "field", [
      "two",
      "three",
    ]);

    t.deepEqual(result, expected);

    return mongo.db().dropCollection(collection);
  },
);
