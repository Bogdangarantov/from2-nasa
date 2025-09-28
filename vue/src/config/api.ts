// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  // In development: http://localhost:3000
  // In production: https://your-domain.com (or relative URL)
  BASE_URL: import.meta.env.VITE_API_URL || '',
  
  // NASA API endpoints
  ENDPOINTS: {
    APOD_TODAY: '/api/nasa/apod',
    APOD_BY_DATE: '/api/nasa/apod',
    APOD_RANDOM: '/api/nasa/apod/random',
  },
  
  // Request timeout (ms)
  TIMEOUT: 30000,
  
  // Retry attempts
  MAX_RETRIES: 3,
}

// Helper function to build full API URL
export const buildApiUrl = (endpoint: string): string => {
  if (API_CONFIG.BASE_URL) {
    return `${API_CONFIG.BASE_URL}${endpoint}`
  }
  // If no base URL, use relative URL (same domain as frontend)
  return endpoint
}

// Helper function to get API URL based on environment
export const getApiUrl = (): string => {
  if (import.meta.env.DEV) {
    // Development: use localhost
    return 'http://localhost:3000'
  } else {
    // Production: use relative URL (same domain)
    return ''
  }
}
