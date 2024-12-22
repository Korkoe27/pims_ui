import axios from "axios";
import { baseURL } from "../services/client/baseurl";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "baseURL", 
  withCredentials: true,           // Automatically include HttpOnly cookies
});

// Handle token refresh when 401 errors occur
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const response = await axiosInstance.post("/auth/api/token/refresh/");
        const newAccessToken = response.data.access;

        // Update the Authorization header dynamically (optional)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
