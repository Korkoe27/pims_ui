import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

// Set up a base URL for your API
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/accounts/api', // Base URL of your backend API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures that cookies are sent with each request
});

// Interceptor for adding CSRF token to every request if available
apiClient.interceptors.request.use((config) => {
  // Log all cookies and headers
  const allCookies = Cookies.get();  // Get all cookies
  console.log("Cookies in request:", allCookies);

  const csrfToken = Cookies.get('csrftoken'); // Get CSRF token from cookies
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken; // Include CSRF token in request headers
  }

  // Log the headers that will be sent with the request
  console.log("Request headers:", config.headers);

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      console.error("Unauthorized access. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

// Define your API calls

// Login API
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/login/', { username, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);  // Log the error for debugging
    throw error;
  }
};

// Logout API
export const logout = async () => {
  try {
    const response = await apiClient.post('/logout/');
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);  // Log the error for debugging
    throw error;
  }
};

// Fetch user profile (example API)
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/profile/');
    return response.data;
  } catch (error) {
    console.error("Fetching profile failed:", error);  // Log the error for debugging
    throw error;
  }
};

// Check session API
export const checkSession = async () => {
  try {
    const response = await apiClient.get("/check-session/");
    return response.data;  // Returns user data if session is valid
  } catch (error) {
    console.error("Session check failed:", error);  // Log the error for debugging
    throw error;
  }
};

export default apiClient;
