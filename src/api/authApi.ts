import httpClient from './httpClient';
import type {AuthCredentials, AuthTokensResponse} from '../features/auth/types';

export interface RefreshTokenPayload {
  refreshToken: string;
}

export const login = async (credentials: AuthCredentials) => {
  const response = await httpClient.post<AuthTokensResponse>('/login', credentials);
  return response.data;
};

export const register = async (credentials: AuthCredentials) => {
  const response = await httpClient.post<AuthTokensResponse>('/register', credentials);
  return response.data;
};

export const refreshToken = async ({refreshToken}: RefreshTokenPayload) => {
  const response = await httpClient.post<AuthTokensResponse>('/refresh-token', {refreshToken});
  return response.data;
};
