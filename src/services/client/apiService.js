import axios from 'axios';
import { baseURL } from './baseurl';
import Cookies from "js-cookie";

// Set up a base URL for your API
const apiClient = axios.create({
  baseURL: baseURL, // Production or local base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure that cookies are sent with each request
});


// Helper to fetch CSRF token
const fetchCSRFToken = () => {
  const csrfToken = Cookies.get("csrftoken"); // Fetch CSRF token from cookies
  console.log("CSRF Token from Cookies:", csrfToken); // Log the token for debugging
  return csrfToken;
};

// Request Interceptor to include CSRF token and print headers
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = fetchCSRFToken();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    // Print headers for debugging
    console.log("Request Headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(
        `Error: ${error.response.status}, ${error.response.data?.detail || 'An error occurred'}`
      );
    }
    throw new Error('Network error, please check your connection');
  }
);

// Login API
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('auth/api/login/', { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Logout API
export const logout = async () => {
  try {
    const response = await apiClient.post('auth/api/logout/');
    return response.data;
  } catch (error) {
    throw new Error('Logout failed');
  }
};

// Fetch user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch profile');
  }
};

// Check session API
export const checkSession = async () => {
  try {
    const response = await apiClient.get('auth/api/check-session/');
    return response.data;
  } catch (error) {
    throw new Error('Failed to check session');
  }
};

export default apiClient;
