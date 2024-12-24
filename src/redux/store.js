/**
 * Store Configuration
 *
 * Configures the Redux store with authentication using RTK Query.
 *
 */

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi"; // Authentication API slice
import authReducer from "../redux/slices/authSlice"; // Authentication state slice

export const store = configureStore({
  reducer: {
    auth: authReducer, // Local state for authentication
    [authApi.reducerPath]: authApi.reducer, // RTK Query reducer for authentication API
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware), // RTK Query middleware for authentication API
});

export default store;
