// @flow
import path from "path";
import {URL} from "url";

export const toEntities = (url: string): string[] => {
  const u = new URL(`http://will-be-ignored.com/${path.basename(url)}`);
  if (!/(.*).xml$/.test(u.pathname)) return [];
  const entities = decodeURIComponent(u.pathname)
    .replace(/\/(.*)\.xml/, "$1")
    .split("+");
  return Array.from(new Set(entities)).sort((a, b) => a.localeCompare(b));
};

export const toUrl = (entities: string[]): string => {
  if (entities.length === 0)
    throw new Error("No entities supplied to form an URL.");

  return `${Array.from(new Set(entities))
    .sort((a, b) => a.localeCompare(b))
    .join("+")}.xml`;
};

export const sanitize = (url: string): string => {
  // FIXME: This regex is probably broken. Find a better regex or way to match
  //        entity names in feed URLS.
  const match = url.match(/([\w_~:\-()?#[\]+]*)(.xml)?$/);
  if (match == null) return url;
  const [, entities, suffix] = match;
  return `${Array.from(new Set(entities.split("+")))
    .sort((a, b) => a.localeCompare(b))
    .join("+")}${suffix == null ? "" : suffix}`;
};

export default {toEntities, toUrl, sanitize};
