import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  userId: localStorage.getItem('userId') || null,
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
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem('token');
      state.userId = null;
      localStorage.removeItem('userId');
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
