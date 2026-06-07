// ============================================
// Core Environment Configuration
// ============================================

/**
 * Centralized environment variable access.
 * Exposes type-safe configurations ensuring the app is backend-ready.
 */
export const env = {
  // Use VITE_API_BASE_URL if it exists (for future REST implementation),
  // otherwise fallback to empty for mock scenarios.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  
  // Flag to enable/disable simulated mock failures (useful for testing error states)
  enableMockFailures: import.meta.env.VITE_ENABLE_MOCK_FAILURES === 'true' || true,
};
