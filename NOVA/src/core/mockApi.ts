// ============================================
// Core Utilities — Mock API Simulation
// ============================================

/**
 * Simulates a network delay.
 * @param ms The delay in milliseconds.
 */
export const simulateDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simulates a network failure based on a provided probability.
 * @param failureRate Probability of failure (0.0 to 1.0). Default is 0.05 (5%).
 * @param errorMessage Custom error message to throw on failure.
 * @throws Error if the simulation falls within the failure rate.
 */
export const simulateFailure = (
  failureRate: number = 0.05,
  errorMessage: string = 'Network error occurred. Please try again.'
): void => {
  if (Math.random() < failureRate) {
    throw new Error(errorMessage);
  }
};
