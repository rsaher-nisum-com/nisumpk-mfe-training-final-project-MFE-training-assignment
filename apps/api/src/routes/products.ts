import { Router } from 'express';
import { findProductById, products } from '../data/products';
import { HttpError } from '../middleware/errorHandler';

export const productsRouter = Router();

productsRouter.get('/', (req, res) => {
  const { category } = req.query;
  const result = category ? products.filter((p) => p.category === category) : products;
  res.json(result);
});

productsRouter.get('/:id', (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) {
    throw new HttpError(404, 'product_not_found', `No product with id "${req.params.id}"`);
  }
  res.json(product);
});
