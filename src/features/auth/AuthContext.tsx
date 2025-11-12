import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {useMutation} from '@tanstack/react-query';
import type {AuthCredentials, AuthTokensResponse, AuthUser} from './types';
import {login as loginRequest, register as registerRequest} from '../../api/authApi';
import {setAuthToken} from '../../api/httpClient';
import type {AxiosError} from 'axios';

const ACCESS_TOKEN_KEY = 'carvago/accessToken';
const REFRESH_TOKEN_KEY = 'carvago/refreshToken';
const USER_KEY = 'carvago/user';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

interface SetTokensPayload {
  accessToken: string | null;
  refreshToken?: string | null;
  user?: AuthUser | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticating: boolean;
  authError: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  setTokens: (tokens: SetTokensPayload) => void;
}

const loadPersistedAuth = (): AuthState => {
  try {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const rawUser = sessionStorage.getItem(USER_KEY);
    const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
    return {accessToken, refreshToken, user};
  } catch (error) {
    console.warn('Unable to read auth tokens from storage.', error);
    return {accessToken: null, refreshToken: null, user: null};
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
  const [authState, setAuthState] = useState<AuthState>(() => loadPersistedAuth());
  const [authError, setAuthError] = useState<string | null>(null);

  const setTokens = useCallback((tokens: SetTokensPayload) => {
    setAuthState((previous) => {
      const nextAccessToken = tokens.accessToken;
      const nextRefreshToken =
        typeof tokens.refreshToken === 'undefined' ? previous.refreshToken : tokens.refreshToken;
      const nextUser = typeof tokens.user === 'undefined' ? previous.user : tokens.user;

      persistAccessToken(nextAccessToken);
      persistRefreshToken(nextRefreshToken ?? null);
      persistUser(nextUser ?? null);
      setAuthToken(nextAccessToken);

      return {
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken ?? null,
        user: nextUser ?? null,
      };
    });
  }, []);

  useEffect(() => {
    setAuthToken(authState.accessToken);
  }, [authState.accessToken]);

  const handleAuthSuccess = useCallback(
    (credentials: AuthCredentials, tokens: AuthTokensResponse) => {
      const user = tokens.user ?? {username: credentials.username};
      setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken ?? null,
        user,
      });
      setAuthError(null);
    },
    [setTokens]
  );

  const resolveErrorMessage = useCallback((error: unknown): string => {
    if (!error) {
      return 'Unexpected error';
    }

    if (typeof error === 'string') {
      return error;
    }

    const axiosError = error as AxiosError<{message?: string; error?: string} | string>;
    const data = axiosError.response?.data;

    if (typeof data === 'string') {
      return data;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }

    if (axiosError.message) {
      return axiosError.message;
    }

    return 'Unexpected error';
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data, variables) => handleAuthSuccess(variables, data),
    onError: (error: unknown) => {
      setAuthError(resolveErrorMessage(error));
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data, variables) => handleAuthSuccess(variables, data),
    onError: (error: unknown) => {
      setAuthError(resolveErrorMessage(error));
    },
  });

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      await loginMutation.mutateAsync(credentials);
    },
    [loginMutation]
  );

  const register = useCallback(
    async (credentials: AuthCredentials) => {
      await registerMutation.mutateAsync(credentials);
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    setAuthState({accessToken: null, refreshToken: null, user: null});
    setAuthError(null);
    clearPersistedAuth();
    setAuthToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: authState.accessToken,
      refreshToken: authState.refreshToken,
      user: authState.user,
      isAuthenticating: loginMutation.isPending || registerMutation.isPending,
      authError,
      login,
      register,
      logout,
      setTokens,
    }),
    [
      authState.accessToken,
      authState.refreshToken,
      authState.user,
      loginMutation.isPending,
      registerMutation.isPending,
      authError,
      login,
      register,
      logout,
      setTokens,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

