// @flow
export const toEntities = (url: string): string[] => {
  const match = url.match(/\/([\w+]*)\.xml$/);
  if (match == null) return [];
  const [, entities] = match;
  return entities.split("+");
};

export default {toEntities};
