export type UserRole = 'admin' | 'user' | 'viewer';

export interface CreateUserData {
  name: string;
  role: UserRole;
}

/**
 * Deterministic test-data factory.
 * No current time, random UUID, or unseeded Faker is used in contract tests.
 */
export class DeterministicDataFactory {
  static user(index: number, role: UserRole = 'user'): CreateUserData {
    if (!Number.isInteger(index) || index < 1) {
      throw new Error(`index must be a positive integer. Received: ${index}`);
    }

    return {
      name: `Automation User ${index}`,
      role,
    };
  }
}
