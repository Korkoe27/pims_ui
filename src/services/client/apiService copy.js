import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
import { baseURL } from './baseurl';

// Set up a base URL for your API
const apiClient = axios.create({
  baseURL: baseURL, // Production or local base URL
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'), // Retrieve CSRF token
  },
  withCredentials: true, // Ensure that cookies are sent with each request
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get('csrftoken'); // Get CSRF token from cookies
    console.log("CSRF Token:", csrfToken); // Log the CSRF token
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken; // Include CSRF token in request headers
    }

    // Log request details
    console.log("REQUEST:");
    console.log("URL:", config.url);
    console.log("Method:", config.method);
    console.log("Headers:", config.headers);
    console.log("Data:", config.data);

    return config;
  },
  (error) => {
    console.error("REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response details
    console.log("RESPONSE:");
    console.log("URL:", response.config.url);
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    console.log("Headers:", response.headers);

    return response;
  },
  (error) => {
    if (error.response) {
      // Log error details
      console.error("RESPONSE ERROR:");
      console.error("URL:", error.response.config.url);
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else {
      console.error("NETWORK ERROR:", error.message);
    }
    return Promise.reject(error);
  }
);

// Define your API calls

// Login API
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('auth/api/login/', { username, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Logout API
export const logout = async () => {
  try {
    const csrfToken = Cookies.get('csrftoken');
    const response = await apiClient.post(
      'auth/api/logout/',
      {},
      {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      }
    );

    // Clear cookies after successful logout
    Cookies.remove('sessionid');
    Cookies.remove('csrftoken');

    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// Fetch user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile/');
    return response.data;
  } catch (error) {
    console.error("Fetching profile failed:", error);
    throw error;
  }
};

// Check session API
export const checkSession = async () => {
  console.log("checkSession function called");
  try {
    const response = await apiClient.get("auth/api/check-session/");
    return response.data;
  } catch (error) {
    console.error("Session check failed:", error);
    throw error;
  }
};

export default apiClient;
