export const Exchanges = {
  /**
   * Calculator Service publishes
   * calculation requests.
   */
  CALCULATION:
    "calculation.exchange",

  /**
   * Workers publish raw results.
   */
  RESULT_RAW:
    "result.raw.exchange",

  /**
   * Result Modifier publishes
   * finalized results.
   */
  RESULT_FINAL:
    "result.final.exchange",

  /**
   * Dead Letter Exchange.
   */
  DEAD_LETTER:
    "deadletter.exchange",
} as const;