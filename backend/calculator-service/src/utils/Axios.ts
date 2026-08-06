import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { logger } from "../config/logger";
import type { HttpClientConfig } from "../types/HttpClientConfig";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

export class AxiosFactory {
  public static create(
    config: HttpClientConfig
  ): AxiosInstance {
    const instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
    });

    this.initializeRequestInterceptor(instance);
    this.initializeResponseInterceptor(instance);

    return instance;
  }

  private static initializeRequestInterceptor(
    instance: AxiosInstance
  ): void {
    instance.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
        request.metadata = {
          startTime: Date.now(),
        };

        logger.info({
          event: "http.request",
          method: request.method?.toUpperCase(),
          url: `${request.baseURL}${request.url}`,
        });

        return request;
      },

      (error: AxiosError) => {
        logger.error({
          event: "http.request.error",
          error: error.message,
        });

        return Promise.reject(error);
      }
    );
  }

  private static initializeResponseInterceptor(
    instance: AxiosInstance
  ): void {
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration =
          Date.now() -
          (response.config.metadata?.startTime ?? Date.now());

        logger.info({
          event: "http.response",
          method: response.config.method?.toUpperCase(),
          url: `${response.config.baseURL}${response.config.url}`,
          status: response.status,
          durationMs: duration,
        });

        return response;
      },

      (error: AxiosError) => {
        const duration =
          Date.now() -
          (error.config?.metadata?.startTime ?? Date.now());

        logger.error({
          event: "http.error",
          method: error.config?.method?.toUpperCase(),
          url: `${error.config?.baseURL}${error.config?.url}`,
          status: error.response?.status,
          durationMs: duration,
          error: error.message,
        });

        return Promise.reject(error);
      }
    );
  }
}