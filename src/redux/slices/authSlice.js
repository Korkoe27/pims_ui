import { createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/client/apiService'; // Import apiClient with RTK Query

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    // Reducer to reset the user state (e.g., after logout)
    resetAuth: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login mutation (fired on login success)
    builder
      .addMatcher(apiClient.endpoints.login.matchFulfilled, (state, action) => {
        console.log("Login successful, payload:", action.payload); // Debugging
        state.user = action.payload; // Update the user state with payload
        state.loading = false;
        state.error = null;
      })
      // Handle logout mutation (fired on logout success)
      .addMatcher(apiClient.endpoints.logout.matchFulfilled, (state) => {
        state.user = null; // Clear user state on logout
        state.error = null;
      })
      // Handle loading and error states
      .addMatcher(apiClient.endpoints.login.matchPending, (state) => {
        state.loading = true; // Set loading to true during login
      })
      .addMatcher(apiClient.endpoints.login.matchRejected, (state, action) => {
        state.error = action.error?.data?.message || "Login failed"; // Capture error message
        state.loading = false;
      })
      .addMatcher(apiClient.endpoints.logout.matchRejected, (state, action) => {
        state.error = action.payload; // Capture error for logout
        state.loading = false;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
