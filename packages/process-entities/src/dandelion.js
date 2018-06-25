// @flow
import {URL} from "url";
import fetch from "isomorphic-fetch";

export type DandelionAnnotation = {
  id: string,
  label: string,
  spot: string,
  title: string,
  uri: string,
  confidence: number,
  language: string,
  fetchedAt: string,
  languageConfidence: number,
};

export const extractEntities = async (
  text: string,
  token: string,
): Promise<DandelionAnnotation[]> => {
  const url = new URL("https://api.dandelion.eu/datatxt/nex/v1");
  const params = {token, text, min_confidence: "0.3"};
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );
  const resp = await fetch(url.toString());
  const {
    annotations,
    timestamp: fetchedAt,
    lang: language,
    langConfidence: languageConfidence,
  } = await resp.json();
  return (annotations || []).map(
    ({id, label, spot, title, uri, confidence}) => ({
      id,
      label,
      spot,
      title,
      uri,
      confidence,
      fetchedAt,
      language,
      languageConfidence,
    }),
  );
};
