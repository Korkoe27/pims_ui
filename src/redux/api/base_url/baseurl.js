/**
 * Base URL Configuration
 *
 * This file contains the base URL for the application's API.
 * Uses environment variables for different environments.
 *
 */

// Get base URL from environment variables with fallback
const getBaseURL = () => {
  // Check for environment variable first
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Fallback based on NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'https://web-production-94f67.up.railway.app';
  }
  
  // Development fallback
  return 'http://localhost:8000';
};

export const baseURL = getBaseURL();

// Add trailing slash if not present
export const apiBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;

// Export environment info for debugging
export const config = {
  baseURL: apiBaseURL,
  environment: process.env.REACT_APP_ENV || process.env.NODE_ENV,
  version: process.env.REACT_APP_VERSION || '1.0.0',
  appName: process.env.REACT_APP_APP_NAME || 'PIMS - Optometry Clinic'
};