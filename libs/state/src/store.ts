import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from '@nisum-mfe/utilities';
import authReducer, { AUTH_STORAGE_KEY, login, logout } from './authSlice';
import cartReducer, { CART_STORAGE_KEY, replaceCart } from './cartSlice';

const logger = createLogger('state');

/**
 * The single Redux store for the whole platform. This module is marked as a
 * Module Federation shared singleton in every app's webpack config
 * (gateway + all three MFEs), so importing '@nisum-mfe/state' from any of
 * them resolves to this exact same instance at runtime - that is what makes
 * "shared state" actually shared across independently-built apps, not just
 * structurally identical copies.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

if (typeof window !== 'undefined') {
  // Persist cart + auth to localStorage on every change (Part 5: browser storage).
  store.subscribe(() => {
    const state = store.getState();
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart.items));
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.auth.user));
    } catch {
      logger.warn('localStorage unavailable - cart/auth persistence disabled for this session');
    }
  });

  // Cross-tab sync (Bonus 5): another tab writing these keys updates this tab's store.
  window.addEventListener('storage', (event) => {
    if (event.storageArea !== window.localStorage) return;

    if (event.key === CART_STORAGE_KEY && event.newValue) {
      try {
        store.dispatch(replaceCart(JSON.parse(event.newValue)));
      } catch {
        logger.warn('Failed to sync cart from another tab');
      }
    }

    if (event.key === AUTH_STORAGE_KEY) {
      try {
        const user = event.newValue ? JSON.parse(event.newValue) : null;
        store.dispatch(user ? login(user) : logout());
      } catch {
        logger.warn('Failed to sync auth from another tab');
      }
    }
  });
}
