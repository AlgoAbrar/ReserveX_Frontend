/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API CONFIGURATION AND AXIOS INSTANCE SETUP
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file configures the HTTP client (Axios) for making API requests to the
 * ReserveX backend. It handles authentication, request/response interception,
 * and error management.
 * 
 * KEY FEATURES:
 * - Automatic JWT token injection for authenticated requests
 * - Centralized error handling
 * - Request/response logging
 * - Auto-redirect on authentication failures
 * 
 * CHANGEABLE CONFIGURATIONS:
 * - API_BASE_URL: Change this if backend URL changes
 * - timeout: Adjust request timeout duration (currently 30 seconds)
 * - Token storage keys: Modify localStorage key names if needed
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import axios from 'axios';

/**
 * Base URL for the ReserveX backend API
 * 
 * IMPORTANT: Update this URL when deploying to different environments
 * - Development: http://localhost:5000/v1
 * - Production: https://reservex.vercel.app/v1
 * - Staging: https://reservex-staging.vercel.app/v1
 */
export const API_BASE_URL = 'https://reservex.vercel.app/v1';

/**
 * Create axios instance with default configuration
 * This instance will be used for all API calls throughout the application
 * 
 * CHANGEABLE SETTINGS:
 * - baseURL: The root URL for all API requests
 * - timeout: Maximum time (in milliseconds) to wait for a response
 * - headers: Default headers sent with every request
 */
export const api = axios.create({
  baseURL: API_BASE_URL, // All requests will be prefixed with this URL
  headers: {
    'Content-Type': 'application/json', // Send JSON data by default
  },
  timeout: 30000, // 30 seconds - increase if backend is slow, decrease for faster failure detection
});

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REQUEST INTERCEPTOR
 * ═══════════════════════════════════════════════════════════════════════════
 * This interceptor runs BEFORE every request is sent
 * It automatically adds the authentication token to requests
 * 
 * HOW IT WORKS:
 * 1. Checks localStorage for saved authentication token
 * 2. If token exists, adds it to the Authorization header
 * 3. Backend validates this token to authenticate the user
 */
api.interceptors.request.use(
  (config) => {
    // Retrieve the JWT token from browser's localStorage
    // CHANGEABLE: Modify 'reservex_auth_token' if you want different storage key
    const token = localStorage.getItem('reservex_auth_token');
    
    if (token) {
      // Add token to Authorization header in Bearer format
      // Format: "Bearer <token>" - this is the standard for JWT authentication
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Optional: Log all outgoing requests (useful for debugging)
    // Uncomment the line below to see all API requests in console
    // console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    
    return config; // Continue with the request
  },
  (error) => {
    // This runs if there's an error in the request setup (rare)
    console.error('Request Setup Error:', error);
    return Promise.reject(error);
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESPONSE INTERCEPTOR
 * ═══════════════════════════════════════════════════════════════════════════
 * This interceptor runs AFTER every response is received
 * It handles errors globally, especially authentication failures
 * 
 * ERROR HANDLING:
 * - 401 Unauthorized: Token expired or invalid → clear auth and redirect to login
 * - 403 Forbidden: User doesn't have permission → handled by individual services
 * - 404 Not Found: Resource doesn't exist → handled by individual services
 * - 500 Server Error: Backend problem → handled by individual services
 */
api.interceptors.response.use(
  (response) => {
    // Optional: Log all successful responses (useful for debugging)
    // Uncomment the line below to see all API responses in console
    // console.log('API Response:', response.status, response.config.url, response.data);
    
    return response; // Pass through successful responses
  },
  (error) => {
    // Check if this is a 401 Unauthorized error
    if (error.response?.status === 401) {
      // 401 means the token is invalid or expired
      
      // Clear all authentication data from localStorage
      // CHANGEABLE: Add/remove storage keys based on what you store
      localStorage.removeItem('reservex_auth_token'); // Remove JWT token
      localStorage.removeItem('reservex_current_user'); // Remove user data
      
      // Redirect user to login page
      // CHANGEABLE: Modify '/auth' if your login route is different
      window.location.href = '/auth';
      
      console.warn('Session expired. Redirecting to login...');
    }
    
    // Let the error continue to be handled by individual service methods
    return Promise.reject(error);
  }
);

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ERROR HANDLER HELPER FUNCTION
 * ═══════════════════════════════════════════════════════════════════════════
 * Standardized error message extraction from Axios errors
 * This function converts various error types into user-friendly messages
 * 
 * ERROR TYPES HANDLED:
 * 1. Server Response Errors (error.response) - Backend returned an error
 * 2. Network Errors (error.request) - Request sent but no response received
 * 3. Setup Errors (error.message) - Error in request configuration
 * 
 * @param error - The error object from Axios
 * @returns User-friendly error message string
 */
export const handleApiError = (error: any): string => {
  // Log the full error for debugging purposes
  console.error('API Error:', error);
  
  if (error.response) {
    // ─────────────────────────────────────────────────────────────────────
    // CASE 1: Server responded with an error status (4xx, 5xx)
    // ─────────────────────────────────────────────────────────────────────
    // The backend is working, but returned an error
    
    // Try to extract error message from response data
    // Backend might send error in different formats, so we check multiple fields
    const message = 
      error.response.data?.message ||  // Standard message field
      error.response.data?.error ||    // Alternative error field
      'An error occurred';             // Fallback message
    
    // Log detailed error information for debugging
    console.error('Server Error:', {
      status: error.response.status,    // HTTP status code (e.g., 400, 404, 500)
      message: message,                 // Error message from backend
      endpoint: error.config?.url       // Which endpoint failed
    });
    
    return message; // Return the error message to display to user
    
  } else if (error.request) {
    // ─────────────────────────────────────────────────────────────────────
    // CASE 2: Request was sent but no response received
    // ─────────────────────────────────────────────────────────────────────
    // This usually means:
    // - Backend server is down
    // - Network connection lost
    // - CORS issues
    // - Request timeout
    
    console.error('Network Error: No response from server');
    
    // CHANGEABLE: Modify this message to be more specific for your users
    return 'Cannot connect to server. Please check if the backend is running and accessible.';
    
  } else {
    // ─────────────────────────────────────────────────────────────────────
    // CASE 3: Error in request setup
    // ─────────────────────────────────────────────────────────────────────
    // This is usually a programming error, not a network/server issue
    
    console.error('Error:', error.message);
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADDITIONAL UTILITY FUNCTIONS (Optional)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Check if the API is reachable
 * Useful for health checks and showing backend status indicators
 * 
 * @returns Promise<boolean> - true if backend is reachable, false otherwise
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    // Try to reach a simple endpoint (health check or any lightweight endpoint)
    // CHANGEABLE: Update '/health' to match your backend's health check endpoint
    await api.get('/health', { timeout: 5000 }); // 5 second timeout for health check
    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

/**
 * Get the current authentication token
 * @returns The JWT token or null if not authenticated
 */
export const getAuthToken = (): string | null => {
  // CHANGEABLE: Modify storage key if needed
  return localStorage.getItem('reservex_auth_token');
};

/**
 * Check if user is currently authenticated
 * @returns true if user has a valid token, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
