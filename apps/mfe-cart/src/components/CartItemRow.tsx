import React from 'react';
import { Button, Card } from '@nisum-mfe/shared-ui';
import { formatCurrency } from '@nisum-mfe/utilities';
import { removeItem, updateQuantity, useAppDispatch } from '@nisum-mfe/state';
import type { CartItem } from '@nisum-mfe/shared-types';

export interface CartItemRowProps {
  item: CartItem;
  highlighted?: boolean;
}

/** One cart line. `highlighted` briefly pulses when this product was just added (see App.tsx's cart:item-added listener). */
export function CartItemRow({ item, highlighted }: CartItemRowProps) {
  const dispatch = useAppDispatch();

  return (
    <Card
      className={highlighted ? 'nisum-cart-item--highlighted' : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}
      data-testid={`cart-item-${item.productId}`}
    >
      {item.image && (
        <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
      )}
      <div style={{ flex: 1 }}>
        <strong>{item.name}</strong>
        <div>{formatCurrency(item.price)} each</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Button
          variant="secondary"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
        >
          -
        </Button>
        <span>{item.quantity}</span>
        <Button
          variant="secondary"
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
        >
          +
        </Button>
      </div>
      <strong>{formatCurrency(item.price * item.quantity)}</strong>
      <Button variant="danger" onClick={() => dispatch(removeItem({ productId: item.productId }))}>
        Remove
      </Button>
    </Card>
  );
}
