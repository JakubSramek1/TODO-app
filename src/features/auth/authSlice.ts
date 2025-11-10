import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {AxiosError, AxiosRequestConfig} from 'axios';
import apiClient from '../../api/apiClient';
import type {AppDispatch, RootState} from '../../app/store';
import type {AuthCredentials, AuthTokensResponse, AuthUser} from './types';

const ACCESS_TOKEN_KEY = 'carvago/accessToken';
const REFRESH_TOKEN_KEY = 'carvago/refreshToken';
const USER_KEY = 'carvago/user';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const loadPersistedAuth = (): Pick<AuthState, 'accessToken' | 'refreshToken' | 'user'> => {
  try {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const rawUser = sessionStorage.getItem(USER_KEY);
    return {
      accessToken,
      refreshToken,
      user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
    };
  } catch (error) {
    // If storage access fails, start from a clean state.
    console.warn('Unable to read auth tokens from storage.', error);
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
    };
  }
};

const persistAccessToken = (token: string | null) => {
  try {
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.warn('Unable to persist access token.', error);
  }
};

const persistRefreshToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.warn('Unable to persist refresh token.', error);
  }
};

const persistUser = (user: AuthUser | null) => {
  try {
    if (user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_KEY);
    }
  } catch (error) {
    console.warn('Unable to persist user.', error);
  }
};

const clearPersistedAuth = () => {
  persistAccessToken(null);
  persistRefreshToken(null);
  persistUser(null);
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  status: 'idle',
  error: null,
};

const persisted = loadPersistedAuth();
initialState.accessToken = persisted.accessToken;
initialState.refreshToken = persisted.refreshToken;
initialState.user = persisted.user;

const resolveErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Unknown error';
  }

  const axiosError = error as AxiosError<{message?: string}>;
  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message;
  }

  if (axiosError.response?.statusText) {
    return axiosError.response.statusText;
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return 'Unexpected error';
};

export const registerUser = createAsyncThunk<
  AuthTokensResponse,
  AuthCredentials,
  {rejectValue: string}
>('auth/registerUser', async ({username, password}, {rejectWithValue}) => {
  try {
    const response = await apiClient.post<AuthTokensResponse>('/register', {
      username,
      password,
    });
    return {
      ...response.data,
      user: response.data.user ?? {username},
    };
  } catch (error) {
    return rejectWithValue(resolveErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  AuthTokensResponse,
  AuthCredentials,
  {rejectValue: string}
>('auth/loginUser', async ({username, password}, {rejectWithValue}) => {
  try {
    const response = await apiClient.post<AuthTokensResponse>('/login', {
      username,
      password,
    });
    return {
      ...response.data,
      user: response.data.user ?? {username},
    };
  } catch (error) {
    return rejectWithValue(resolveErrorMessage(error));
  }
});

export const refreshAccessToken = createAsyncThunk<
  AuthTokensResponse,
  void,
  {state: RootState; rejectValue: string}
>('auth/refreshAccessToken', async (_, {getState, rejectWithValue}) => {
  try {
    const refreshToken = getState().auth.refreshToken ?? localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return rejectWithValue('Missing refresh token');
    }

    const response = await apiClient.post<AuthTokensResponse>('/refresh-token', {refreshToken}, {
      skipAuthRefresh: true,
    } as AxiosRequestConfig);

    return response.data;
  } catch (error) {
    return rejectWithValue(resolveErrorMessage(error));
  }
});

export const logout = createAsyncThunk<void, void, {dispatch: AppDispatch}>(
  'auth/logout',
  async (_, {dispatch}) => {
    clearPersistedAuth();
    // Allow future enhancements (e.g., audit logging) via dispatch.
    dispatch(authSlice.actions.resetState());
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken?: string | null;
        user?: AuthUser | null;
      }>
    ) => {
      const {accessToken, refreshToken, user} = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = typeof refreshToken === 'undefined' ? state.refreshToken : refreshToken;
      state.user = typeof user === 'undefined' ? state.user : (user ?? null);
      persistAccessToken(accessToken);
      if (typeof refreshToken !== 'undefined') {
        persistRefreshToken(refreshToken);
      }
      if (typeof user !== 'undefined') {
        persistUser(user ?? null);
      }
    },
  },
  extraReducers: (builder) => {
    const fulfilled = (state: AuthState, action: PayloadAction<AuthTokensResponse>) => {
      state.status = 'succeeded';
      state.error = null;
      const {accessToken, refreshToken, user} = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      if (user) {
        state.user = user;
      }
      persistAccessToken(accessToken);
      if (refreshToken) {
        persistRefreshToken(refreshToken);
      }
      if (user) {
        persistUser(user);
      }
    };

    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to register';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to login';
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        persistAccessToken(action.payload.accessToken);
        if (action.payload.user) {
          state.user = action.payload.user;
          persistUser(action.payload.user);
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.accessToken = null;
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to refresh access token';
        persistAccessToken(null);
      });
  },
});

export const {setTokens} = authSlice.actions;

export const selectAccessToken = (state: RootState) => state.auth.accessToken ?? undefined;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken ?? undefined;
export const selectUsername = (state: RootState) => state.auth.user?.username;
export const selectAccessTokenOrNull = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;
