import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@nisum-mfe/shared-types';

export interface CartState {
  items: CartItem[];
}

export const CART_STORAGE_KEY = 'nisum-mfe:cart';

function loadInitialItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export interface AddItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadInitialItems() } as CartState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { productId, name, price, image, quantity = 1 } = action.payload;
      const existing = state.items.find((item) => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, name, price, image, quantity });
      }
    },
    removeItem(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter((item) => item.productId !== action.payload.productId);
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
    /** Used to reconcile this tab's cart when another tab changes it (cross-tab sync). */
    replaceCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, replaceCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }): CartItem[] => state.cart.items;
export const selectCartTotalItems = (state: { cart: CartState }): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = (state: { cart: CartState }): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
