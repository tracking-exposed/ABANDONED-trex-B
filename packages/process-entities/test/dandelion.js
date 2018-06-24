import path from "path";
import test from "ava";
import nock from "nock";
import {entities} from "../src/dandelion";

nock.disableNetConnect();
const nockBack = nock.back;

nockBack.fixtures = path.join(__dirname, "fixtures");
nockBack.setMode("lockdown");

const token = "token";
const text =
  "When you setup an interceptor for a URL and that interceptor is used, it is removed from the interceptor list.";

// eslint-disable-next-line promise/catch-or-return
nockBack("dandelion-entities.json").then(({nockDone}) =>
  test("fetch entities", async (t) => {
    nock("https://api.dandelion.eu")
      .get("/datatxt/nex/v1")
      .query({
        min_confidence: "0.3",
        token,
        text,
      });
    const results = await entities(text, "token");
    t.is(2, results.length);
    return nockDone();
  }),
);
