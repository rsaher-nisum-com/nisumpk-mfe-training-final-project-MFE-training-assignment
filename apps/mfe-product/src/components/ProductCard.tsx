import React from 'react';
import { Button, Card } from '@nisum-mfe/shared-ui';
import { addItem, useAppDispatch } from '@nisum-mfe/state';
import { NISUM } from '@nisum-mfe/events';
import { formatCurrency } from '@nisum-mfe/utilities';
import type { Product } from '@nisum-mfe/shared-types';

export interface ProductCardProps {
  product: Product;
}

/**
 * "Add to cart" is the one action in this project that goes through BOTH
 * data-sharing mechanisms at once: it dispatches into the shared Redux store
 * (the cart's actual contents, read by the Cart MFE) AND emits a NISUM event
 * (a loosely-coupled notification, picked up by the Cart MFE + the gateway's
 * toast/badge). See README "Data-Sharing Strategy" for why both exist here.
 */
export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleSelect = (): void => {
    NISUM.emit('product:selected', { productId: product.id, name: product.name });
  };

  const handleAddToCart = (event: React.MouseEvent): void => {
    event.stopPropagation();
    dispatch(
      addItem({ productId: product.id, name: product.name, price: product.price, image: product.image }),
    );
    NISUM.emit('cart:item-added', {
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
    });
    NISUM.emit('notification:show', { message: `${product.name} added to cart`, level: 'success' });
  };

  return (
    <Card onClick={handleSelect} style={{ cursor: 'pointer' }} data-testid={`product-card-${product.id}`}>
      <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} />
      <h3 style={{ margin: '0 0 4px' }}>{product.name}</h3>
      <p style={{ color: 'var(--nisum-color-muted, #6b7280)', fontSize: 13, minHeight: 36 }}>
        {product.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>{formatCurrency(product.price)}</strong>
        <Button onClick={handleAddToCart}>Add to cart</Button>
      </div>
    </Card>
  );
}
