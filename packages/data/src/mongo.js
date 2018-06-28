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
    .findOne(query);

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

export default {
  client,
  findOneBy,
  upsertOne,
};
