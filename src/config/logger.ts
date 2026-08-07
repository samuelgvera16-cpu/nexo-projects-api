import pino from "pino";

import { env } from "./env.js";

const logLevel =
  env.NODE_ENV === "test"
    ? "silent"
    : env.NODE_ENV === "production"
      ? "info"
      : "debug";

export const logger = pino({
  level: logLevel,
  base: {
    service: "nexo-projects-api",
    environment: env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    censor: "[REDACTED]",
  },
  serializers: {
    err: pino.stdSerializers.err,
  },
});
