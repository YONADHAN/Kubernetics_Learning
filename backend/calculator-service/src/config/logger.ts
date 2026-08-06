import pino from "pino";

import { env } from "./env";

const isDevelopment = env.NODE_ENV === "development";

export const logger = pino({
  name: env.SERVICE_NAME,

  level: env.LOG_LEVEL,

  timestamp: pino.stdTimeFunctions.isoTime,

  transport: isDevelopment
    ? {
        target: "pino-pretty",

        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: false,
        },
      }
    : undefined,
});