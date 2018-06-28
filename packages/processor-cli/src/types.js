// @flow
import type {StreamEvent} from "@tracking-exposed/data/src/redis";

export type StreamProcessor = (
  StreamEvent,
  {[string]: string},
) => Promise<void>;
