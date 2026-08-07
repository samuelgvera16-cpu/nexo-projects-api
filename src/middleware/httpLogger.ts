import { randomUUID } from "node:crypto";

import { pinoHttp } from "pino-http";

import { logger } from "../config/logger.js";

export const httpLogger = pinoHttp({
  logger,

  genReqId(req, res) {
    const incomingRequestId = req.headers["x-request-id"];

    const requestId =
      typeof incomingRequestId === "string" &&
      incomingRequestId.length > 0 &&
      incomingRequestId.length <= 100
        ? incomingRequestId
        : randomUUID();

    res.setHeader("X-Request-Id", requestId);

    return requestId;
  },

  customLogLevel(_req, res, error) {
    if (error || res.statusCode >= 500) {
      return "error";
    }

    if (res.statusCode >= 400) {
      return "warn";
    }

    return "info";
  },
});
