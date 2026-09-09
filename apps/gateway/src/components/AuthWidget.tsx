import React, { useState } from 'react';
import { Button } from '@nisum-mfe/shared-ui';
import { login, logout, selectUser, useAppDispatch, useAppSelector } from '@nisum-mfe/state';
import { NISUM } from '@nisum-mfe/events';
import { fetchJson, readEnv } from '@nisum-mfe/utilities';
import type { User } from '@nisum-mfe/shared-types';

const SEED_EMAILS = ['ava@example.com', 'marcus@example.com'];

/**
 * Mock login widget - lives in the gateway header, not a separate MFE. On
 * success it both dispatches into the shared authSlice (the actual "current
 * user" state every MFE reads) and emits `user:login` on NISUM, so any app
 * can react to the transition without subscribing to Redux directly.
 */
export function AuthWidget() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState(SEED_EMAILS[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const foundUser = await fetchJson<User>(`${readEnv('API_URL', 'http://localhost:4000')}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      dispatch(login(foundUser));
      NISUM.emit('user:login', foundUser);
      NISUM.emit('notification:show', { message: `Welcome back, ${foundUser.name}!`, level: 'success' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = (): void => {
    dispatch(logout());
    NISUM.emit('user:logout', {});
    NISUM.emit('notification:show', { message: 'Logged out', level: 'info' });
  };

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Hi, {user.name}</span>
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <label htmlFor="mock-login-email" style={{ fontSize: 13 }}>
        Log in as
      </label>
      <select id="mock-login-email" value={email} onChange={(event) => setEmail(event.target.value)}>
        {SEED_EMAILS.map((seedEmail) => (
          <option key={seedEmail} value={seedEmail}>
            {seedEmail}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Log in'}
      </Button>
      {error && <span style={{ color: 'var(--nisum-color-danger, #dc2626)', fontSize: 13 }}>{error}</span>}
    </form>
  );
}
