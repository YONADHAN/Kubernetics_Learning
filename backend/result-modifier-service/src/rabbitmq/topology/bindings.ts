import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { RoutingKeys } from "./routingKeys";

export const Bindings = [
  /**
   * Arithmetic Workers
   */
  {
    exchange:
      Exchanges.CALCULATION,

    queue:
      Queues.ADDITION,

    routingKey:
      RoutingKeys.ADD,
  },

  {
    exchange:
      Exchanges.CALCULATION,

    queue:
      Queues.SUBTRACTION,

    routingKey:
      RoutingKeys.SUB,
  },

  {
    exchange:
      Exchanges.CALCULATION,

    queue:
      Queues.MULTIPLICATION,

    routingKey:
      RoutingKeys.MUL,
  },

  {
    exchange:
      Exchanges.CALCULATION,

    queue:
      Queues.DIVISION,

    routingKey:
      RoutingKeys.DIV,
  },

  /**
   * Result Modifier
   */
  {
    exchange:
      Exchanges.RESULT_RAW,

    queue:
      Queues.RESULT_RAW,

    routingKey:
      RoutingKeys.RESULT_RAW,
  },

  /**
   * Calculator Service
   */
  {
    exchange:
      Exchanges.RESULT_FINAL,

    queue:
      Queues.RESULT_FINAL,

    routingKey:
      RoutingKeys.RESULT_FINAL,
  },

  /**
   * Dead Letter Queue
   */
  {
    exchange:
      Exchanges.DEAD_LETTER,

    queue:
      Queues.DEAD_LETTER,

    routingKey: "",
  },
] as const;