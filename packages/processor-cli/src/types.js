// @flow
import type {StreamEvent} from "./redis";

export type StreamProcessor = (
  StreamEvent,
  {[string]: string},
) => Promise<void>;
