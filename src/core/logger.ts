export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContext = {
  correlationId?: string;
  action?: string;
  method?: string;
  path?: string;
  durationMs?: number;
  error?: string;
  [key: string]: unknown;
};

export class Logger {
  constructor(
    private readonly scope: string,
    private readonly baseContext: LogContext = {}
  ) {}

  debug(message: string, context: LogContext = {}): void {
    this.write('debug', message, context);
  }

  info(message: string, context: LogContext = {}): void {
    this.write('info', message, context);
  }

  warn(message: string, context: LogContext = {}): void {
    this.write('warn', message, context);
  }

  error(message: string, context: LogContext = {}): void {
    this.write('error', message, context);
  }

  private write(level: LogLevel, message: string, context: LogContext): void {
    const mergedContext = { ...this.baseContext, ...context };
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      scope: this.scope,
      message,
      ...mergedContext,
      correlationId: this.valueOrNull(mergedContext.correlationId),
      action: this.valueOrNull(mergedContext.action),
      method: this.valueOrNull(mergedContext.method),
      path: this.valueOrNull(mergedContext.path),
      durationMs: this.valueOrNull(mergedContext.durationMs),
      error: this.valueOrNull(mergedContext.error)
    };
    // Structured console output keeps CI logs readable without another dependency.
    console.log(JSON.stringify(payload));
  }

  private valueOrNull(value: unknown): unknown {
    return value === undefined ? null : value;
  }
}
