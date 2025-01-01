/**
 * Auth Slice
 *
 * Manages authentication state, including user data, loading state, and error handling.
 * Integrates with Redux Persist to enable persistent authentication.
 * Also works with `authApi` to handle login, logout, and token refresh processes via RTK Query.
 */

import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/features/authApi";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Stores the logged-in user's data
    loading: false, // Indicates if an authentication action is in progress
    error: null, // Stores error messages related to authentication
  },
  reducers: {
    // Manually set user data (useful for initial session restoration)
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Reset authentication state (used during logout)
    resetAuth: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false; // Reset loading state
    },
  },
  extraReducers: (builder) => {
    // Handle successful login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log("Login successful, payload:", action.payload);
        state.user = action.payload.user; // Update user state
        state.loading = false;
        state.error = null;
      }
    );
    // Handle successful logout
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.user = null; // Clear user state
      state.error = null;
    });
    // Handle login pending state
    builder.addMatcher(authApi.endpoints.login.matchPending, (state) => {
      state.loading = true; // Indicate loading during login
    });
    // Handle login errors
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        state.error =
          action.error?.data?.detail || action.error?.message || "Login failed";
        state.loading = false;
      }
    );
    // Handle logout errors
    builder.addMatcher(
      authApi.endpoints.logout.matchRejected,
      (state, action) => {
        state.error =
          action.error?.data?.detail || action.error?.message || "Logout failed";
        state.loading = false;
      }
    );
  },
});

// Export the actions for use in components
export const { setUser, resetAuth } = authSlice.actions;

const persistConfig = {
  key: "auth", // The key under which the auth slice is stored in local storage
  storage, // Storage engine
  whitelist: ["user"], // Only persist the user state
};

// Wrap the reducer with persistReducer
export default persistReducer(persistConfig, authSlice.reducer);
