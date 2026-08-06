import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { RoutingKeys } from "./routingKeys";

export const Bindings = [
  {
    exchange: Exchanges.CALCULATION,
    queue: Queues.DIVISION,
    routingKey: RoutingKeys.DIV,
  },

  {
    exchange: Exchanges.RESULT_RAW,
    queue: Queues.RESULT_RAW,
    routingKey: RoutingKeys.RESULT_RAW,
  },

  {
    exchange: Exchanges.RESULT_FINAL,
    queue: Queues.RESULT_FINAL,
    routingKey: RoutingKeys.RESULT_FINAL,
  },

  {
    exchange: Exchanges.DEAD_LETTER,
    queue: Queues.DEAD_LETTER,
    routingKey: "",
  },
] as const;