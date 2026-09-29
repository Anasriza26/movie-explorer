import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest } from './authApi';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginRequest(credentials); // resolves with { username }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    // Ignore double-clicks while a login is already in flight.
    condition: (_, { getState }) => getState().auth.status !== 'loading',
  }
);

export const initialState = {
  user: null, // { username } | null  <- the ONLY persisted field (never the password)
  status: 'idle', // 'idle' | 'loading' | 'failed' (transient)
  error: null, // transient
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
    clearAuthError(state) {
      state.error = null;
      if (state.status === 'failed') state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = { username: payload.username };
        state.status = 'idle';
      })
      .addCase(login.rejected, (state, { payload, error }) => {
        state.status = 'failed';
        state.error = payload || error.message;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectUsername = (state) => state.auth.user?.username;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;
