import { describe, expect, it } from 'vitest';
import authReducer, { login, logout, selectIsAuthenticated, type AuthState } from '../authSlice';

const loggedOut: AuthState = { user: null };

describe('authSlice reducer', () => {
  it('starts logged out', () => {
    expect(authReducer(undefined, { type: '@@INIT' }).user).toBeNull();
  });

  it('logs a user in', () => {
    const state = authReducer(loggedOut, login({ id: 'u1', name: 'Ada', email: 'ada@example.com' }));
    expect(state.user).toEqual({ id: 'u1', name: 'Ada', email: 'ada@example.com' });
  });

  it('logs a user out', () => {
    const loggedIn: AuthState = { user: { id: 'u1', name: 'Ada', email: 'ada@example.com' } };
    const state = authReducer(loggedIn, logout());
    expect(state.user).toBeNull();
  });
});

describe('selectIsAuthenticated', () => {
  it('is false with no user', () => {
    expect(selectIsAuthenticated({ auth: loggedOut })).toBe(false);
  });

  it('is true with a user', () => {
    expect(selectIsAuthenticated({ auth: { user: { id: 'u1', name: 'Ada', email: 'ada@example.com' } } })).toBe(true);
  });
});
