export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
