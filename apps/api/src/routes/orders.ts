import { Router } from 'express';
import type { CartItem } from '@nisum-mfe/shared-types';
import { createOrder, listOrdersByUser } from '../data/ordersStore';
import { HttpError } from '../middleware/errorHandler';

export const ordersRouter = Router();

function isValidItems(items: unknown): items is CartItem[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item: any) =>
        item &&
        typeof item.productId === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0,
    )
  );
}

ordersRouter.get('/', (req, res) => {
  const userId = req.query.userId;
  if (typeof userId !== 'string' || !userId) {
    throw new HttpError(400, 'invalid_request', 'Query param "userId" is required.');
  }
  res.json(listOrdersByUser(userId));
});

ordersRouter.post('/', (req, res) => {
  const { userId, items } = req.body ?? {};
  if (typeof userId !== 'string' || !userId) {
    throw new HttpError(400, 'invalid_request', 'Field "userId" is required.');
  }
  if (!isValidItems(items)) {
    throw new HttpError(400, 'invalid_request', 'Field "items" must be a non-empty array of cart items.');
  }
  const order = createOrder(userId, items);
  res.status(201).json(order);
});
