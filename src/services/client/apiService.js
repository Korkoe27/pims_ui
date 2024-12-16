import axios from 'axios';
import { baseURL } from './baseurl';

// Utility to fetch CSRF token from the backend
const fetchCSRFToken = async () => {
  try {
    const response = await axios.get(`${baseURL}auth/api/get-csrf-token/`, {
      withCredentials: true,
    });
    return response.data?.csrftoken;
  } catch (error) {
    throw new Error('Failed to fetch CSRF token');
  }
};

// Set up a base URL for your API
const apiClient = axios.create({
  baseURL: baseURL, // Production or local base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure that cookies are sent with each request
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    if (!config.headers['X-CSRFToken']) {
      const csrfToken = await fetchCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
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
