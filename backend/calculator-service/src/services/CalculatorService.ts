import { memoizationClient } from "./MemoizationClient";
import { pendingRequestStore } from "./PendingRequestStore";

import { retryPublisher } from "../rabbitmq/RetryPublisher";

import { Exchanges } from "../rabbitmq/topology/exchanges";
import { RoutingKeys } from "../rabbitmq/topology/routingKeys";

import type { CalculationRequest } from "../types/calculator/CalculationRequest";
import type { CalculationResponse } from "../types/calculator/CalculationResponse";

export class CalculatorService {

    public async calculate(
        request: CalculationRequest
    ): Promise<CalculationResponse> {

        const cacheKey =
            this.buildCacheKey(request);

        const cached =
            await memoizationClient.lookup<number>(
                cacheKey
            );

        if(cached.hit){

            return {

                success:true,

                result: cached.value!,

                cached:true,

                correlationId: request.correlationId

            };

        }

        const pending =
            pendingRequestStore.create<CalculationResponse>(
                request.correlationId
            );

        await retryPublisher.publish({

            exchange: Exchanges.CALCULATION,

            routingKey:
                this.getRoutingKey(
                    request.operation
                ),

            correlationId:
                request.correlationId,

            message: request

        });

        const result =
            await pending;

        await memoizationClient.store({

            key: cacheKey,

            value: result.result

        });

        return result;

    }

    private buildCacheKey(
        request: CalculationRequest
    ): string {

        return `${request.operation}:${request.firstNumber}:${request.secondNumber}`;

    }

    private getRoutingKey(
        operation: CalculationRequest["operation"]
    ): string {

        switch(operation){

            case "add":
                return RoutingKeys.ADD;

            case "sub":
                return RoutingKeys.SUB;

            case "mul":
                return RoutingKeys.MUL;

            case "div":
                return RoutingKeys.DIV;

        }

    }

}

export const calculatorService =
    new CalculatorService();