import Redis from "ioredis";

import { env } from "./env";
import { logger } from "./logger";

export const redis = new Redis(
  env.REDIS_URL,
  {
    maxRetriesPerRequest: null,

    enableReadyCheck: true,
  }
);

redis.on("connect", () => {
  logger.info({
    event: "redis.connected",
  });
});

redis.on("ready", () => {
  logger.info({
    event: "redis.ready",
  });
});

redis.on("error", (error) => {
  logger.error({
    event: "redis.error",
    error: error.message,
  });
});

redis.on("close", () => {
  logger.warn({
    event: "redis.closed",
  });
});