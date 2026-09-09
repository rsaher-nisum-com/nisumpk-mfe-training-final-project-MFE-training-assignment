// Domain types shared across every app in the monorepo. Kept dependency-free
// (no React/Redux imports here) so every workspace - frontend or backend - can
// depend on it without pulling in unrelated tooling.

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'pending' | 'confirmed';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
}

/**
 * Compile-time contract for the NISUM window event bus (see @nisum-mfe/events).
 * Every event name emitted or listened to across the platform must be a key
 * here so `NISUM.emit`/`NISUM.listener` stay type-safe end to end.
 */
export interface NisumEventMap {
  'cart:item-added': { productId: string; name: string; quantity: number; price: number };
  'cart:item-removed': { productId: string };
  'cart:updated': { totalItems: number; totalPrice: number };
  'product:selected': { productId: string; name: string };
  'order:created': { orderId: string; total: number; itemCount: number };
  'user:login': User;
  'user:logout': Record<string, never>;
  'notification:show': { message: string; level: 'info' | 'success' | 'error' | 'warning' };
}

export type NisumEventName = keyof NisumEventMap;
