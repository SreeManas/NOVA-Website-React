// ============================================
// Core Types — Async State
// ============================================

/**
 * Standardized wrapper for asynchronous operations in UI hooks.
 * Ensures consistent handling of loading, error, and success states.
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Helper to initialize the default state of an AsyncState object.
 */
export const defaultAsyncState = <T>(): AsyncState<T> => ({
  data: null,
  loading: false,
  error: null,
});
