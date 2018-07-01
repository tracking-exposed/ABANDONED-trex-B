// @flow
import dotenv from "dotenv";
import cli from "./cli";

dotenv.config();

export default async (opts: {[string]: mixed} = {}) => {
  const cfg = Object.assign(cli().parse(), opts);
  console.log(cfg);
};
