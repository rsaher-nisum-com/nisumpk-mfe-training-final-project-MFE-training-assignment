import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

const app = createApp();

describe('GET /api/products', () => {
  it('returns the seeded product catalog', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('price');
  });

  it('filters by category', async () => {
    const res = await request(app).get('/api/products?category=Electronics');
    expect(res.status).toBe(200);
    expect(res.body.every((p: { category: string }) => p.category === 'Electronics')).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('returns a single product', async () => {
    const res = await request(app).get('/api/products/p1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('p1');
  });

  it('returns 404 for an unknown product', async () => {
    const res = await request(app).get('/api/products/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('product_not_found');
  });
});
