import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

const app = createApp();

describe('POST /api/orders', () => {
  it('creates an order from cart items and returns it', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        userId: 'u1',
        items: [{ productId: 'p1', name: 'Wireless Headphones', price: 89.99, quantity: 2 }],
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ userId: 'u1', total: 179.98, status: 'confirmed' });
    expect(res.body.id).toBeTruthy();
  });

  it('rejects a request with no items', async () => {
    const res = await request(app).post('/api/orders').send({ userId: 'u1', items: [] });
    expect(res.status).toBe(400);
  });

  it('rejects a request with no userId', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ items: [{ productId: 'p1', name: 'Mug', price: 10, quantity: 1 }] });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/orders', () => {
  it('lists orders for a given userId', async () => {
    await request(app)
      .post('/api/orders')
      .send({ userId: 'u2', items: [{ productId: 'p3', name: 'Mug', price: 14.5, quantity: 1 }] });

    const res = await request(app).get('/api/orders?userId=u2');
    expect(res.status).toBe(200);
    expect(res.body.every((order: { userId: string }) => order.userId === 'u2')).toBe(true);
  });

  it('requires a userId query param', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(400);
  });
});
