import { redisClient } from "../shared/config/redis";

export class RedisRepository {
  private readonly client =
    redisClient.getClient();

  public async get<T>(
    key: string
  ): Promise<T | null> {
    const value =
      await this.client.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public async set<T>(
    key: string,
    value: T,
    ttlInSeconds?: number
  ): Promise<void> {
    const serialized =
      JSON.stringify(value);

    if (ttlInSeconds) {
      await this.client.set(
        key,
        serialized,
        {
          EX: ttlInSeconds,
        }
      );

      return;
    }

    await this.client.set(
      key,
      serialized
    );
  }

  public async delete(
    key: string
  ): Promise<void> {
    await this.client.del(key);
  }

  public async exists(
    key: string
  ): Promise<boolean> {
    return (
      (await this.client.exists(key)) === 1
    );
  }
}

export const redisRepository =
  new RedisRepository();