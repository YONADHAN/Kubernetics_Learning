import type { HttpClientConfig } from "../types/HttpClientConfig";
import { env } from "./env";

export const memoizationConfig: HttpClientConfig = {
  baseURL: env.MEMOIZATION_SERVICE_URL,

  timeout: env.REQUEST_TIMEOUT,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const memoizationApi = {
  get: "/api/v1/cache",
  set: "/api/v1/cache",
  delete: "/api/v1/cache",
} as const;