import type { AuthApi } from '../api/auth-api';
import type { AuthSession } from '../models/auth.model';
import type { LoginRequest } from '../models/auth.model';
import { Logger, type LogContext } from '../core/logger';

export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly authApi: AuthApi,
    loggerContext: LogContext = {}
  ) {
    this.logger = new Logger('AuthService', loggerContext);
  }

  async login(credentials: LoginRequest): Promise<AuthSession> {
    const startedAt = Date.now();
    this.logger.info('Service action started', {
      action: 'service.login',
      method: 'SERVICE',
      email: credentials.email
    });
    try {
      const session = await this.authApi.login(credentials);
      this.logger.info('Service action succeeded', {
        action: 'service.login',
        method: 'SERVICE',
        email: credentials.email,
        durationMs: Date.now() - startedAt
      });
      return session;
    } catch (error: unknown) {
      this.logger.error('Service action failed', {
        action: 'service.login',
        method: 'SERVICE',
        email: credentials.email,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  loginAsAdmin(email: string, password: string): Promise<AuthSession> {
    return this.login({ email, password });
  }

  loginAsCustomer(email: string, password: string): Promise<AuthSession> {
    return this.login({ email, password });
  }
}
