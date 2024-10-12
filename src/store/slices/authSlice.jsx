import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
  refreshToken: null,
  userRole: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reduxLogin: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userRole = action.payload.userRole;
      state.isAuthenticated = true;
    },
    reduxLogout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userRole = null;
      state.isAuthenticated = false;
    },
  },
});

export const { reduxLogin, reduxLogout } = authSlice.actions;

export default authSlice.reducer;