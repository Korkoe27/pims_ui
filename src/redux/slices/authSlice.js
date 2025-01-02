import { createSlice } from "@reduxjs/toolkit";
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
    // Manually set user data
    setUser: (state, action) => {
      state.user = action.payload;
    },
    // Reset authentication state (used during logout)
    resetAuth: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false; // Reset loading state
    },
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add extraReducers if integrating directly with RTK Query APIs
  },
});

export const { setUser, resetAuth, setLoading, setError } = authSlice.actions;

const persistConfig = {
  key: "auth",
  storage, // Use localStorage for persisting auth state
  whitelist: ["user"], // Only persist the user state
};

export default persistReducer(persistConfig, authSlice.reducer);
