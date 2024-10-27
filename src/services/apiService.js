import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

// Set up a base URL for your API
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/', // Local 
  // baseURL: 'https://optometryclinic-production.up.railway.app/', // Production 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures that cookies are sent with each request
});

// Interceptor for adding CSRF token to every request if available
apiClient.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrftoken'); // Get CSRF token from cookies
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken; // Include CSRF token in request headers
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access. Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

// Define your API calls

// Login API
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('accounts/api/login/', { username, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Logout API with cookie clearing
// Logout API
export const logout = async () => {
  try {
    // Get the CSRF token from cookies
    const csrfToken = Cookies.get('csrftoken');

    // Make the logout request and include the CSRF token in the headers
    const response = await apiClient.post('accounts/api/logout/', {}, {
      headers: {
        'X-CSRFToken': csrfToken,  // Ensure CSRF token is passed in headers
      },
    });
    
    // Clear cookies after successful logout
    Cookies.remove('sessionid');
    Cookies.remove('csrftoken');
    
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);  // Log the error for debugging
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
  console.log("checkSession function called"); // Log when the function is called
  try {
    const response = await apiClient.get("accounts/api/check-session/");
    console.log("Session check response:", response.data); // Log the response data
    return response.data;  // Returns user data if session is valid
  } catch (error) {
    console.error("Session check failed:", error); // Log the error if the request fails
    throw error;
  }
};

export default apiClient;
