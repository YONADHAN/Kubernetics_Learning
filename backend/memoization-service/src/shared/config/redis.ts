import { createClient } from "redis";

import { env } from "./env";
import { logger } from "./logger";

class RedisClient {
  private readonly client = createClient({
    url: env.REDIS_URL,
  });

  constructor() {
    this.client.on("connect", () => {
      logger.info({
        event: "redis.connecting",
      });
    });

    this.client.on("ready", () => {
      logger.info({
        event: "redis.ready",
      });
    });

    this.client.on("error", (error) => {
      logger.error({
        event: "redis.error",
        error: error.message,
      });
    });

    this.client.on("end", () => {
      logger.warn({
        event: "redis.disconnected",
      });
    });
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  public getClient() {
    return this.client;
  }
}

export const redisClient = new RedisClient();