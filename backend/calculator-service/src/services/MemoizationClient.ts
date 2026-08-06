import { AxiosFactory } from "../utils/Axios";

import {
  memoizationApi,
  memoizationConfig,
} from "../config/memoization";

import type { CacheLookupResponse } from "../types/memoization/CacheLookupResponse";
import type { CacheStoreRequest } from "../types/memoization/CacheStoreRequest";

export class MemoizationClient {
  private readonly client =
    AxiosFactory.create(memoizationConfig);

  public async lookup<T>(
    key: string
  ): Promise<CacheLookupResponse<T>> {
    const response =
      await this.client.get<CacheLookupResponse<T>>(
        memoizationApi.cache,
        {
          params: {
            key,
          },
        }
      );

    return response.data;
  }

  public async store<T>(
    payload: CacheStoreRequest<T>
  ): Promise<void> {
    await this.client.post(
      memoizationApi.cache,
      payload
    );
  }

  public async invalidate(
    key: string
  ): Promise<void> {
    await this.client.delete(
      `${memoizationApi.cache}/${encodeURIComponent(
        key
      )}`
    );
  }
}

export const memoizationClient =
  new MemoizationClient();