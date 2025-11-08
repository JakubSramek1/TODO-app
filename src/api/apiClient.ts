import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import type {AuthTokensResponse} from '../features/auth/types';

interface TokenHandlers {
  getAccessToken?: () => string | null | undefined;
  getRefreshToken?: () => string | null | undefined;
  onRefreshSuccess?: (payload: AuthTokensResponse) => void;
  onRefreshFailure?: () => void;
}

interface AuthenticatedRequestConfig extends InternalAxiosRequestConfig {
  skipAuthRefresh?: boolean;
  _retry?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: false,
});

let handlers: TokenHandlers = {};
let refreshPromise: Promise<AuthTokensResponse> | null = null;

const setAuthorizationHeader = (config: AxiosRequestConfig) => {
  if (config.headers?.Authorization) {
    return config;
  }

  const accessToken = handlers.getAccessToken?.();
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return config;
};

apiClient.interceptors.request.use((config) => {
  const typedConfig = config as AuthenticatedRequestConfig;

  if (!typedConfig.skipAuthRefresh) {
    setAuthorizationHeader(config);
  }

  return config;
});

const performRefresh = async (): Promise<AuthTokensResponse> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = handlers.getRefreshToken?.();
  if (!refreshToken) {
    handlers.onRefreshFailure?.();
    throw new Error('Missing refresh token');
  }

  refreshPromise = axios
    .post<AuthTokensResponse>('/refresh-token', {refreshToken}, {
      baseURL: apiClient.defaults.baseURL,
      skipAuthRefresh: true,
    } as AuthenticatedRequestConfig)
    .then((response) => {
      handlers.onRefreshSuccess?.(response.data);
      return response.data;
    })
    .catch((error) => {
      handlers.onRefreshFailure?.();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const responseStatus = error.response?.status;
    const originalRequest = error.config as AuthenticatedRequestConfig | undefined;

    if (
      responseStatus === 401 &&
      originalRequest &&
      !originalRequest.skipAuthRefresh &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResult = await performRefresh();

        // ✅ Update Authorization header safely
        if (originalRequest.headers) {
          // Axios 1.x: headers might be an instance of AxiosHeaders
          (originalRequest.headers as any).set?.(
            'Authorization',
            `Bearer ${refreshResult.accessToken}`
          );

          // fallback for when it's just a plain object
          if (typeof (originalRequest.headers as any).set !== 'function') {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${refreshResult.accessToken}`,
            } as any;
          }
        } else {
          originalRequest.headers = {
            Authorization: `Bearer ${refreshResult.accessToken}`,
          } as any;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // handle refresh failure (logout, etc.)
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export const bindAuthInterceptors = (tokenHandlers: TokenHandlers) => {
  handlers = {
    getAccessToken: tokenHandlers.getAccessToken,
    getRefreshToken: tokenHandlers.getRefreshToken,
    onRefreshSuccess: tokenHandlers.onRefreshSuccess,
    onRefreshFailure: tokenHandlers.onRefreshFailure,
  };
};

export default apiClient;
