import type { HttpClientConfig } from "../types/HttpClientConfig";
import { env } from "./env";

export const calculatorConfig: HttpClientConfig = {
  baseURL: env.CALCULATOR_SERVICE_URL,
  timeout: env.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const calculatorApi = {
  calculate: "/api/v1/calculate",
  health: "/health",
} as const;