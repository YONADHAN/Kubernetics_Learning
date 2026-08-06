import { redisRepository } from "../repositories/RedisRepository";

import type { CacheLookupResponse } from "../shared/types/CacheLookupResponse";
import type { CacheStoreRequest } from "../shared/types/CacheStoreRequest";

export class MemoizationService {
  /**
   * Lookup a cached value.
   */
  public async lookup<T>(
    key: string
  ): Promise<CacheLookupResponse<T>> {
    const value =
      await redisRepository.get<T>(key);

    if (value === null) {
      return {
        success: true,
        hit: false,
      };
    }

    return {
      success: true,
      hit: true,
      value,
    };
  }

  /**
   * Store a value.
   */
  public async store<T>(
    payload: CacheStoreRequest<T>
  ): Promise<void> {
    await redisRepository.set(
      payload.key,
      payload.value,
      3600 // 1 hour TTL
    );
  }

  /**
   * Remove a cached value.
   */
  public async invalidate(
    key: string
  ): Promise<void> {
    await redisRepository.delete(key);
  }
}

export const memoizationService =
  new MemoizationService();