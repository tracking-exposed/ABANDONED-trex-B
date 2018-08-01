// @flow
import type {MongoClient} from "mongodb";
import RSS from "rss";
import {findOneBy, upsertOne, addToSet, findByMember} from "./mongo";
import {sha1} from "./utils";

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
  permaLink?: string,
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

type Header = {
  title: string,
  feed_url: string,
  site_url: string,
  pubDate: Date,
};

export const fetch = async (
  mongo: MongoClient,
  id: string,
): Promise<Impression | null> => {
  const impression = await findOneBy(mongo, "impressions2", {id});
  if (impression == null) return Promise.resolve(null);
  const html = await findOneBy(mongo, "htmls2", {
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
    upsertOne(mongo, "impressions2", {id: impression.id}, impression),
    upsertOne(mongo, "htmls2", {id: html.id}, html),
  ]);
};

export const addEntities = async (
  mongo: MongoClient,
  id: string,
  entities: string[],
): Promise<void> => addToSet(mongo, "impressions2", {id}, "entities", entities);

export const fetchByEntities = async (
  mongo: MongoClient,
  entities: string | string[],
): Promise<Array<Impression>> => {
  const impressions = await findByMember(
    mongo,
    "impressions2",
    "entities",
    entities,
  );
  return Promise.all(
    impressions.map(async (impression) => {
      const html = await findOneBy(mongo, "htmls2", {id: impression.htmlId});
      return Object.assign({}, impression, {html});
    }),
  );
};

export const toRss = (
  url: string,
  feedHeader: Header,
  impressions: Impression[],
) => {
  const feed = new RSS(feedHeader);
  impressions.forEach((impression) => {
    if (
      impression.html != null &&
      impression.html.permaLink != null &&
      impression.html.text != null
    ) {
      feed.item({
        title:
          impression.html.source != null
            ? `From ${impression.html.source}`
            : `Missing author name ${impression.html.permaLink}`,
        description: impression.html.text,
        url:
          impression.html && impression.html.permaLink.startsWith("/")
            ? `https://www.facebook.com${impression.html.permaLink}`
            : impression.html.permaLink,
        guid: sha1(impression.html.text),
        date: impression.html.savingTime,
      });
    }
  });
  return feed.xml();
};

export default {
  fetch,
  store,
  addEntities,
  fetchByEntities,
  toRss,
};
