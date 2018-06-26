// @flow
import {MongoClient} from "mongodb";

type Impression = {
  impressionId: string,
  timelineId: string,
};

// FIXME: flow's type definition for mongodb inject any for all mongodb
//        operations. Verify any return from any mongodb operation.

export const client = async (
  connectionString: string,
): Promise<MongoClient> => {
  const mongo = await MongoClient.connect(connectionString);
  return mongo;
};

export const fetchImpression = async (
  mongo: MongoClient,
  id: string,
): Promise<Impression> =>
  mongo
    .db()
    .collection("impressions")
    .findOne({id});

export default {
  client,
  fetchImpression,
};
