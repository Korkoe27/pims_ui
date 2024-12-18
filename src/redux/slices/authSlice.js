import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkSession, login, logout } from '../../services/client/apiService';

// Check user session
export const checkUserSession = createAsyncThunk('auth/checkSession', async (_, thunkAPI) => {
  try {
    const res = await checkSession();
    return res.user;
  } catch (error) {
    return thunkAPI.rejectWithValue('Session expired or invalid');
  }
});

// Login user
export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await login(credentials.username, credentials.password);
    return res.user;
  } catch (error) {
    return thunkAPI.rejectWithValue('Login failed');
  }
});

// Logout user
export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await logout(); // Call logout API
    return null; // No payload needed, clears user state
  } catch (error) {
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      // Check session
      .addCase(checkUserSession.pending, (state) => { state.loading = true; })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; // Clear user state
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;

