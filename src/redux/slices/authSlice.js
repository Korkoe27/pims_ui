import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi'; // Import the correct RTK Query slice

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Reducer to reset the user state (e.g., after logout)
    resetAuth: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login mutation (fired on login success)
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log("authSlice: matchFulfilled triggered, payload:", action.payload.user); // Debugging
        state.user = action.payload.user; // Update user in the slice
        state.loading = false;
        state.error = null;
      })
      // Handle logout mutation (fired on logout success)
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null; // Clear user state on logout
        state.error = null;
      })
      // Handle loading and error states
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true; // Set loading to true during login
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.error = action.error?.data?.message || "Login failed"; // Capture error message
        state.loading = false;
      })
      .addMatcher(authApi.endpoints.logout.matchRejected, (state, action) => {
        state.error = action.payload; // Capture error for logout
        state.loading = false;
      });
  },
});

export const { setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
