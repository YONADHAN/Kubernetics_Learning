import { redis } from "../config/redis";

export class InboxRepository {
  private readonly prefix = "inbox:";

  /**
   * Returns true if the message
   * has already been processed.
   */
  public async isProcessed(
    messageId: string
  ): Promise<boolean> {
    const exists = await redis.exists(
      `${this.prefix}${messageId}`
    );

    return exists === 1;
  }

  /**
   * Marks a message as processed.
   */
  public async markProcessed(
    messageId: string
  ): Promise<void> {
    await redis.set(
      `${this.prefix}${messageId}`,
      "processed"
    );
  }

  /**
   * Removes a processed marker.
   * Useful for testing.
   */
  public async remove(
    messageId: string
  ): Promise<void> {
    await redis.del(
      `${this.prefix}${messageId}`
    );
  }
}

export const inboxRepository =
  new InboxRepository();