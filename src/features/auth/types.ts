export interface AuthUser {
  username: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}
