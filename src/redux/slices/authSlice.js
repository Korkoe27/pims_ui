import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkSession, login, logout } from '../../services/client/apiService';

export const checkUserSession = createAsyncThunk('auth/checkSession', async (_, thunkAPI) => {
  try {
    const res = await checkSession();
    return res.user;
  } catch (error) {
    return thunkAPI.rejectWithValue('Session expired or invalid');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await login(credentials.username, credentials.password);
    return res.user;
  } catch (error) {
    return thunkAPI.rejectWithValue('Login failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserSession.pending, (state) => { state.loading = true; })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
