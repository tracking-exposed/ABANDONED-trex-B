#!/usr/bin/env node
/**
   Use the script the following way:

   $ TREX_PASSWORD=<PASS> ./.scripts/fetch-impressions-to-stream.js
*/
const path = require("path");
const fetch = require("isomorphic-fetch");

const {mongo, redis, impressions, entities} = require("@tracking-exposed/data");

const pass = process.env.TREX_PASSWORD;
const now = Math.floor(new Date().getTime() / 1000);
const URL = "https://facebook.tracking.exposed/api/v1/exportText";

const mongoHost = "localhost";
const mongoPort = 27017;
const mongoDb = "facebook";

const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`;

(async () => {
  const mongoClient = await mongo.client(mongoUri);
  const redisClient = redis.client();

  const data = await fetch(`${URL}/${pass}/${now}`).then((resp) => resp.json());

  console.log(`Fetched ${data.length} impressions`);

  await Promise.all(
    data.map(async ({impressionId, id, ...html}) => {
      const impression = Object.assign(
        {},
        {
          id: impressionId,
          htmlId: id,
          html: Object.assign({}, html, {id, impressionId}),
        },
      );
      console.log(impression);
      await impressions.store(mongoClient, impression);
      await redis.publishToStream(redisClient, "impressions", {impressionId});
    }),
  );

  process.exit(0);
})();
