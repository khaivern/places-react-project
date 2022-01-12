import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
  expiration: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
  expiration: localStorage.getItem('expiration' || null),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthState>) {
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token!);
      state.userId = action.payload.userId;
      localStorage.setItem('userId', action.payload.userId!);
      state.expiration = action.payload.expiration;
      localStorage.setItem('expiration', action.payload.expiration!);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
      state.userId = null;
      localStorage.removeItem('userId');
      state.expiration = null;
      localStorage.removeItem('expiration');
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
