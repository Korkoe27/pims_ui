import axios from 'axios';
import { baseURL } from './baseurl';

// Utility to fetch CSRF token from the backend
const fetchCSRFToken = async () => {
  try {
    const response = await axios.get(`${baseURL}/auth/api/get-csrf-token/`, {
      withCredentials: true,
    });
    const csrfToken = response.data?.csrftoken;
    console.log('Fetched CSRF Token:', csrfToken);
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
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
    // Fetch CSRF token dynamically if not already set
    if (!config.headers['X-CSRFToken']) {
      const csrfToken = await fetchCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    // Log request details
    console.log('REQUEST:', {
      URL: config.url,
      Method: config.method,
      Headers: config.headers,
      Data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response details
    console.log('RESPONSE:', {
      URL: response.config.url,
      Status: response.status,
      Data: response.data,
      Headers: response.headers,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('RESPONSE ERROR:', {
        URL: error.response.config?.url,
        Status: error.response.status,
        Data: error.response.data,
        Headers: error.response.headers,
      });
    } else {
      console.error('NETWORK ERROR:', error.message);
    }
    return Promise.reject(error);
  }
);

// Define your API calls

// Login API
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('auth/api/login/', { username, password });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Logout API
export const logout = async () => {
  try {
    const response = await apiClient.post('auth/api/logout/');
    console.log('Logout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Fetch user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile/');
    console.log('Profile fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Fetching profile failed:', error);
    throw error;
  }
};

// Check session API
export const checkSession = async () => {
  console.log('checkSession function called');
  try {
    const response = await apiClient.get('auth/api/check-session/');
    console.log('Session active:', response.data);
    return response.data;
  } catch (error) {
    console.error('Session check failed:', error);
    throw error;
  }
};

export default apiClient;
