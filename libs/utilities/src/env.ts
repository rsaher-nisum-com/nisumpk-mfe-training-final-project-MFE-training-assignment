/**
 * Reads environment-specific config that each app's webpack.config.js injects
 * via DefinePlugin (from .env/.env.development/.env.production - see each
 * app's webpack.config.js). Centralized here so no component ever touches
 * `process.env` directly, and a missing var fails loudly instead of silently
 * resolving to `undefined` inside a URL string.
 */
export function readEnv(key: string, fallback?: string): string {
  const value = typeof process !== 'undefined' ? process.env[key] : undefined;
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
}

export function readBoolEnv(key: string, fallback = false): boolean {
  const value = typeof process !== 'undefined' ? process.env[key] : undefined;
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
}
