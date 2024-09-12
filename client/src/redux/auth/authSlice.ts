import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { UserStateType } from '../../types/userTypes';
import { checkUserThunk, logoutThunk, signInThunk, signUpThunk } from './authActionThunk';

export type InitStateType = {
  accessToken: string;
  user: UserStateType;
};

const initialState: InitStateType = {
  accessToken: '',
  user: { status: 'fetching' },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpThunk.fulfilled, (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = { status: 'logged', ...payload.user };
    });

    builder.addCase(signInThunk.fulfilled, (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = { status: 'logged', ...payload.user };
    });

    builder.addCase(checkUserThunk.fulfilled, (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = { status: 'logged', ...payload.user };
    });
    builder.addCase(checkUserThunk.rejected, (state, { payload }) => {
      state.accessToken = '';
      state.user = { status: 'guest' };
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.accessToken = '';
      state.user = { status: 'guest' };
    })
  },
});

export default authSlice;
