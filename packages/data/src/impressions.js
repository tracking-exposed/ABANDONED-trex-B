// @flow
import type {MongoClient} from "mongodb";
import {findOneBy, upsertOne, addToSet, findByMember} from "./mongo";

type HtmlSnippet = {
  id: string,
  impressionId: string,
  timelineId: string,
  userId: number,
  savingTime: Date,
  html: string,
  // feedBasicInfo
  feedBasicInfo: boolean,
  postId?: string,
  permalink?: string,
  // eslint-disable-next-line flowtype/space-after-type-colon
  hrefType?:
    | "post"
    | "photo"
    | "groupPost"
    | "video"
    | "event"
    | "notes"
    | "album",
  // postType
  postType?: boolean,
  type?: "feed" | "promoted",
  // promotedInfo
  promotedInfo?: boolean,
  ownerName?: string,
  promotedPage?: string,
  // promotedMedia?: boolean, // The parser can set it to page as well
  // promotedLink
  promotedLink?: boolean,
  linkType?: "link" | "video" | "page",
  postLink?: string,
  // promotedTitle
  promotedTitle?: boolean,
  titleId?: string,
  title?: string,
  // feedUTime
  feedUTime?: boolean,
  publicationUTime?: number,
  // feedText
  feedText?: boolean,
  source?: string,
  text?: string,
  reason?: string,
  // feedHref
  feedHref?: boolean,
  externalHref?: string[],
  // interactions
  interactions?: boolean,
  rmap?: Array<{label: string, type: number, amount: number}>,
  rtotal?: number,
  shares?: number,
  comments?: number,
};

type Impression = {
  id: string,
  timelineId: string,
  htmlId: string,
  userId: number,
  impressionOrder: number,
  impressionTime: Date,
  visibility: "public" | "private",
  entities: string[],
  html: HtmlSnippet,
};

export const fetch = async (
  mongo: MongoClient,
  id: string,
): Promise<Impression | null> => {
  const impression = await findOneBy(mongo, "impressions", {id});
  if (impression == null) return Promise.resolve(null);
  const html = await findOneBy(mongo, "htmls", {
    id: impression.htmlId,
  });

  return Promise.resolve(Object.assign({}, impression, {html}));
};

export const store = async (
  mongo: MongoClient,
  data: Impression,
): Promise<void> => {
  const {html, ...impression} = data;
  await Promise.all([
    upsertOne(mongo, "impressions", {id: impression.id}, impression),
    upsertOne(mongo, "htmls", {id: html.id}, html),
  ]);
};

export const addEntities = async (
  mongo: MongoClient,
  id: string,
  entities: string[],
): Promise<void> => addToSet(mongo, "impressions", {id}, "entities", entities);

export const fetchByEntity = async (
  mongo: MongoClient,
  entities: string | string[],
): Promise<Array<Impression>> => {
  const impressions = await findByMember(
    mongo,
    "impressions",
    "entities",
    entities,
  );
  return Promise.all(
    impressions.map(async (impression) => {
      const html = await findOneBy(mongo, "htmls", {id: impression.htmlId});
      return Object.assign({}, impression, {html});
    }),
  );
};

export default {
  fetch,
  store,
  addEntities,
  fetchByEntity,
};
