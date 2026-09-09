import React from 'react';
import { Card } from '@nisum-mfe/shared-ui';
import { formatCurrency } from '@nisum-mfe/utilities';
import type { Order } from '@nisum-mfe/shared-types';

export interface OrderRowProps {
  order: Order;
}

export function OrderRow({ order }: OrderRowProps) {
  return (
    <Card style={{ marginBottom: 8 }} data-testid={`order-${order.id}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{order.id}</strong>
        <span>{new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <div>
        {order.items.length} item{order.items.length === 1 ? '' : 's'}
      </div>
      <strong>{formatCurrency(order.total)}</strong>
    </Card>
  );
}
