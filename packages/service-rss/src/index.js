// @flow
import type {IncomingMessage} from "http";

export default (req: IncomingMessage) => {
  console.log(`Servicing ${req.url}`);
  return "Hello World";
};
