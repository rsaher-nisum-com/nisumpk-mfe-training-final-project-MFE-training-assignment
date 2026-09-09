import React from 'react';
import { ErrorPanel, LoadingPanel } from '@nisum-mfe/shared-ui';
import { selectUser, useAppSelector } from '@nisum-mfe/state';
import { useNisumListener } from '@nisum-mfe/events';
import { useOrders } from './hooks/useOrders';
import { OrderRow } from './components/OrderRow';

/**
 * Exposed as `mfeOrders/OrdersApp` (the 3rd, bonus MFE). Reads the logged-in
 * user from shared state and refetches automatically when it receives
 * `order:created` from the Cart MFE - the checkout -> order-history handoff
 * happens purely over the event bus, with no direct import between the two.
 */
export default function App() {
  const user = useAppSelector(selectUser);
  const { orders, status, error, reload } = useOrders(user?.id);

  useNisumListener('order:created', () => {
    reload();
  });

  if (!user) {
    return (
      <div>
        <h2>Order History</h2>
        <ErrorPanel title="Login required" message="Log in from the header to see your orders." />
      </div>
    );
  }

  return (
    <div>
      <h2>Order History</h2>
      {status === 'loading' && <LoadingPanel label="Loading orders..." />}
      {status === 'error' && <ErrorPanel message={error ?? 'Failed to load orders.'} onRetry={reload} />}
      {status === 'success' && orders.length === 0 && <p>No orders yet - go add something to your cart!</p>}
      {status === 'success' && orders.map((order) => <OrderRow key={order.id} order={order} />)}
    </div>
  );
}
