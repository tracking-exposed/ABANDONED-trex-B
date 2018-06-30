// @flow
import crypto from "crypto";

export const sha1 = (s: string): string =>
  crypto
    .createHash("sha1")
    .update(s)
    .digest("hex");
