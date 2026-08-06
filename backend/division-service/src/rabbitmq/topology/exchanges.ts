export const Exchanges = {
  /**
   * Calculator Service
   * publishes calculation requests here.
   */
  CALCULATION: "calculation.exchange",

  /**
   * Workers publish raw results here.
   */
  RESULT_RAW: "result.raw.exchange",

  /**
   * Result Modifier publishes
   * formatted results here.
   */
  RESULT_FINAL: "result.final.exchange",

  /**
   * Failed messages.
   */
  DEAD_LETTER: "deadletter.exchange",
} as const;