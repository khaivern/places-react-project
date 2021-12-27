import { createSlice } from '@reduxjs/toolkit';

const storedData = JSON.parse(localStorage.getItem('userData'));

const hasToken = storedData && storedData.token;
const hasUserId = storedData && storedData.userId;

const initialAuthState = {
  isAuthenticated: hasToken ? !!storedData.token : false,
  userId: hasUserId ? storedData.userId : null,
  token: hasToken ? storedData.token : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;

      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: action.payload.userId,
          token: action.payload.token,
        })
      );
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userId = null;
      state.token = null;
      localStorage.removeItem('userData');
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
