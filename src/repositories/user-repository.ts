import type { UsersApi } from '../api/users-api';
import type { UserResponse } from '../models/user.model';

export class UserRepository {
  constructor(private readonly usersApi: UsersApi) {}

  list(): Promise<{ data: UserResponse[] }> {
    return this.usersApi.getUsers();
  }

  byId(userId: string): Promise<UserResponse> {
    return this.usersApi.getUser(userId);
  }
}
