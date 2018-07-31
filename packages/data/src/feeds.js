// @flow
import path from "path";
import {URL} from "url";

export const toEntities = (url: string): string[] => {
  const u = url.startsWith("http")
    ? new URL(url)
    : new URL(`http://will-be-ignored.com/${path.basename(url)}`);
  const entityPath = path
    .basename(u.pathname)
    .replace(/\.xml$/, "")
    .replace(/\/(.*)/, "$1");
  if (entityPath === "") return [];
  const entities = entityPath.split("+").map(decodeURIComponent);
  return Array.from(new Set(entities)).sort((a, b) => a.localeCompare(b));
};

export const toUrl = (entities: string[]): string => {
  if (entities.length === 0)
    throw new Error("No entities supplied to form an URL.");

  return Array.from(new Set(entities))
    .sort((a, b) => a.localeCompare(b))
    .join("+");
};

export const sanitize = (url: string): string => toUrl(toEntities(url));

export default {toEntities, toUrl, sanitize};
