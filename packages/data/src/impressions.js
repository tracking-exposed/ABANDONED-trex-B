// @flow
import type {MongoClient} from "mongodb";
import {findOneBy, upsertOne} from "./mongo";

type Impression = {
  id: string,
  timelineId: string,
};

export const fetch = async (
  mongo: MongoClient,
  id: string,
): Promise<Impression> => findOneBy(mongo, "impressions", {id});

export const store = async (
  mongo: MongoClient,
  impression: Impression,
): Promise<void> =>
  upsertOne(mongo, "impressions", {id: impression.id}, impression);

export default {
  fetch,
  store,
};
