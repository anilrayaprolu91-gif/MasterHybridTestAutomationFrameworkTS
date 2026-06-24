import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import type { AuthSession, LoginRequest, TokenResponse } from '../models/auth.model';
import type { UserRequest, UserResponse } from '../models/user.model';

export class AuthApi extends BaseApiClient {
  
  async login(credentials: LoginRequest): Promise<AuthSession> {
    const response = await this.postJson<LoginRequest, TokenResponse>(endpoints.auth.login, credentials);
    return {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in
    };
  }

  async register(user: UserRequest): Promise<UserResponse> {
    return this.postJson<UserRequest, UserResponse>(endpoints.users.register, user);
  }

  async me(accessToken: string): Promise<UserResponse> {
    return this.getJson<UserResponse>(endpoints.users.me, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  async logout(accessToken: string): Promise<void> {
    await this.getVoid(endpoints.users.logout, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  async refresh(accessToken: string): Promise<AuthSession> {
    const token = await this.getJson<TokenResponse>(endpoints.users.refresh, {
      Authorization: `Bearer ${accessToken}`
    });
    return {
      accessToken: token.access_token,
      tokenType: token.token_type,
      expiresIn: token.expires_in
    };
  }
}

export async function createAuthApi(request: APIRequestContext): Promise<AuthApi> {
  return new AuthApi(request);
}
