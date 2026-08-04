import type {
  AxiosInstance,
} from "axios";

import { AxiosFactory } from "../utils/Axios";

import {
  calculatorApi,
  calculatorConfig,
} from "../config/calculator";

import type {
  CalculationRequest,
  CalculationResponse,
} from "../types/calculator";

export class CalculatorServiceClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client =
      AxiosFactory.create(calculatorConfig);
  }

  public async calculate(
    payload: CalculationRequest
  ): Promise<CalculationResponse> {
    const { data } =
      await this.client.post<CalculationResponse>(
        calculatorApi.calculate,
        payload
      );

    return data;
  }

  public async health(): Promise<boolean> {
    const response =
      await this.client.get(
        calculatorApi.health
      );

    return response.status === 200;
  }
}

export const calculatorServiceClient =
  new CalculatorServiceClient();