import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@nisum-mfe/shared-types';

export interface AuthState {
  user: User | null;
}

export const AUTH_STORAGE_KEY = 'nisum-mfe:auth';

function loadInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: loadInitialUser() } as AuthState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }): User | null => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => state.auth.user !== null;
