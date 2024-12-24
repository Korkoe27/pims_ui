import { createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../../services/client/apiService'; // Import apiClient with RTK Query

// Auth Slice to manage the state of the user and loading/error states
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
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      // Handle logout mutation (fired on logout success)
      .addMatcher(apiClient.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      // Handle loading and error states
      .addMatcher(apiClient.endpoints.login.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(apiClient.endpoints.logout.matchRejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
