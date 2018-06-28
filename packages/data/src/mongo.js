// @flow
import {MongoClient} from "mongodb";

// FIXME: flow's type definition for mongodb inject any for all mongodb
//        operations. Verify any return from any mongodb operation.
export const client = async (
  connectionString: string,
): Promise<MongoClient> => {
  const mongo = await MongoClient.connect(connectionString);
  return mongo;
};

export const findOneBy = <T>(
  mongo: MongoClient,
  collection: string,
  query: {[string]: mixed},
): Promise<T> =>
  mongo
    .db()
    .collection(collection)
    .findOne(query, {projection: {_id: 0}});

export const upsertOne = <T>(
  mongo: MongoClient,
  collection: string,
  query: {[string]: mixed},
  data: T,
): Promise<void> =>
  mongo
    .db()
    .collection(collection)
    .updateOne(query, {$set: data}, {upsert: true});

export const addToSet = <T>(
  mongo: MongoClient,
  collection: string,
  query: {[string]: mixed},
  field: string,
  values: T | Array<T>,
): Promise<void> =>
  mongo
    .db()
    .collection(collection)
    .updateOne(query, {
      $addToSet: {[field]: {$each: Array.isArray(values) ? values : [values]}},
    });

export const findByMember = <R, T>(
  mongo: MongoClient,
  collection: string,
  field: string,
  members: R | Array<R>,
): Promise<Array<T>> =>
  mongo
    .db()
    .collection(collection)
    .find(
      {[field]: {$all: Array.isArray(members) ? members : [members]}},
      {_id: 0},
    )
    .limit(100)
    .toArray();

export default {
  client,
  findOneBy,
  upsertOne,
  addToSet,
  findByMember,
};
