/**
 * Axios Configuration
 * 
 * This file configures an Axios instance for making API requests.
 * It includes support for handling HttpOnly cookies and automatic token refresh when encountering 401 errors.
 * 
 */

/////////////////////////
// Axios Instance
/////////////////////////

import axios from "axios";
import { baseURL } from "../services/client/baseurl"; // Import the base URL dynamically

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL, // Use the imported base URL
  withCredentials: true, // Automatically include HttpOnly cookies
});

/////////////////////////
// Interceptors
/////////////////////////

// Handle token refresh when 401 errors occur
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses through unchanged
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const response = await axiosInstance.post("/auth/api/token/refresh/");
        const newAccessToken = response.data.access;

        // Update the Authorization header dynamically
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Reject other errors
  }
);

export default axiosInstance;
