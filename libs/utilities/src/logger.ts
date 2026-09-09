type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Minimal structured logger shared by every app (frontend and backend). It
 * doesn't ship data anywhere on its own - it exists so every app produces
 * consistent, greppable, timestamped log lines instead of ad-hoc
 * console.log calls, which is the cheapest form of observability a training
 * project can add without standing up a real logging backend.
 */
function log(scope: string, level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const line = `[${new Date().toISOString()}] [${scope}] [${level.toUpperCase()}] ${message}`;
  const method = level === 'debug' ? 'log' : level;
  // eslint-disable-next-line no-console
  (console[method] as (...args: unknown[]) => void)(line, meta ?? '');
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, meta?: Record<string, unknown>) => log(scope, 'debug', message, meta),
    info: (message: string, meta?: Record<string, unknown>) => log(scope, 'info', message, meta),
    warn: (message: string, meta?: Record<string, unknown>) => log(scope, 'warn', message, meta),
    error: (message: string, meta?: Record<string, unknown>) => log(scope, 'error', message, meta),
  };
}
