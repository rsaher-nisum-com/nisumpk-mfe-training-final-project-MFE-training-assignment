import type { CartItem, Order } from '@nisum-mfe/shared-types';

const orders: Order[] = [];
let nextId = 1;

export function createOrder(userId: string, items: CartItem[]): Order {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order: Order = {
    id: `ord_${nextId++}`,
    userId,
    items,
    total: Math.round(total * 100) / 100,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  return order;
}

export function listOrdersByUser(userId: string): Order[] {
  return orders.filter((order) => order.userId === userId);
}

export function listAllOrders(): Order[] {
  return orders;
}
