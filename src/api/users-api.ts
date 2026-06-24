import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../core/base-api-client';
import { endpoints } from '../config/endpoints';
import { toQueryString } from './api-utils';
import type { PaginatedResponse, UserRequest, UserResponse } from '../models/user.model';

export class UsersApi extends BaseApiClient {
  getUsers(page?: number): Promise<PaginatedResponse<UserResponse>> {
    return this.getJson<PaginatedResponse<UserResponse>>(`${endpoints.users.root}${toQueryString({ page })}`);
  }

  getUser(userId: string): Promise<UserResponse> {
    return this.getJson<UserResponse>(endpoints.users.item(userId));
  }

  searchUsers(query: string, page?: number): Promise<UserResponse[]> {
    return this.getJson<UserResponse[]>(`${endpoints.users.search}${toQueryString({ q: query, page })}`);
  }

  updateUser(userId: string, user: Partial<UserRequest>, accessToken: string): Promise<{ success: boolean }> {
    return this.putJson<Partial<UserRequest>, { success: boolean }>(endpoints.users.item(userId), user, {
      Authorization: `Bearer ${accessToken}`
    });
  }

  deleteUser(userId: string, accessToken: string): Promise<void> {
    return this.delete(endpoints.users.item(userId), {
      Authorization: `Bearer ${accessToken}`
    });
  }

  forgotPassword(email: string): Promise<{ success: boolean }> {
    return this.postJson<{ email: string }, { success: boolean }>(endpoints.users.forgotPassword, { email });
  }

  changePassword(payload: { current_password: string; new_password: string; new_password_confirmation: string }, accessToken: string): Promise<{ success: boolean }> {
    return this.postJson<typeof payload, { success: boolean }>(endpoints.users.changePassword, payload, {
      Authorization: `Bearer ${accessToken}`
    });
  }
}

export async function createUsersApi(request: APIRequestContext): Promise<UsersApi> {
  return new UsersApi(request);
}
