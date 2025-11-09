import {configureStore} from '@reduxjs/toolkit';
import authReducer, {
  logout,
  selectAccessToken,
  selectRefreshToken,
  setTokens,
} from '../features/auth/authSlice';
import {bindAuthInterceptors} from '../api/apiClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

bindAuthInterceptors({
  getAccessToken: () => selectAccessToken(store.getState()) ?? null,
  getRefreshToken: () => selectRefreshToken(store.getState()) ?? null,
  onRefreshSuccess: ({accessToken, refreshToken, user}) => {
    store.dispatch(
      setTokens({
        accessToken,
        refreshToken: typeof refreshToken === 'string' ? refreshToken : undefined,
        user,
      })
    );
  },
  onRefreshFailure: () => {
    void store.dispatch(logout());
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
