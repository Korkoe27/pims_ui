import axios from 'axios';
import { baseURL } from './baseurl';

// Axios Instance Configuration
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies with each request
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${error.response.data?.detail || 'An error occurred'}`
      );
    }
    throw new Error('Network error, please check your connection');
  }
);

// API Endpoints

/** Login API */
export const login = async (username, password) => {
  const endpoint = 'auth/api/login/';
  try {
    const { data } = await apiClient.post(endpoint, { username, password });
    return data;
  } catch (error) {
    throw new Error('Login failed');
  }
};

/** Logout API */
export const logout = async () => {
  const endpoint = 'auth/api/logout/';
  try {
    const { data } = await apiClient.post(endpoint);
    return data;
  } catch (error) {
    throw new Error('Logout failed');
  }
};

/** Fetch User Profile */
export const getUserProfile = async () => {
  const endpoint = '/profile/';
  try {
    const { data } = await apiClient.get(endpoint);
    return data;
  } catch (error) {
    throw new Error('Failed to fetch profile');
  }
};

/** Check User Session */
export const checkSession = async () => {
  const endpoint = 'auth/api/check-session/';
  try {
    const { data } = await apiClient.get(endpoint);
    return data;
  } catch (error) {
    throw new Error('Failed to check session');
  }
};

export default apiClient;
