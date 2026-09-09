import React, { useState } from 'react';
import { Button, ErrorPanel } from '@nisum-mfe/shared-ui';
import {
  clearCart,
  selectCartItems,
  selectCartTotalPrice,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from '@nisum-mfe/state';
import { NISUM, useNisumListener } from '@nisum-mfe/events';
import { formatCurrency } from '@nisum-mfe/utilities';
import { CartItemRow } from './components/CartItemRow';
import { useCheckout } from './hooks/useCheckout';

/**
 * Exposed as `mfeCart/CartApp`. Demonstrates BOTH data-sharing mechanisms on
 * the receiving end: it reads the cart directly from the shared Redux store
 * (state sharing) and separately listens for `cart:item-added` (event
 * sharing) purely to briefly highlight the row that was just added - a
 * concern the store itself has no reason to know about.
 */
export default function App() {
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotalPrice);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { submitOrder, status, error } = useCheckout();
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useNisumListener('cart:item-added', ({ productId }) => {
    setHighlighted(productId);
    setTimeout(() => setHighlighted((current) => (current === productId ? null : current)), 1500);
  });

  const handleCheckout = async (): Promise<void> => {
    if (!user || items.length === 0) return;
    try {
      const order = await submitOrder(user.id, items);
      dispatch(clearCart());
      setConfirmation(`Order ${order.id} confirmed - thank you!`);
      NISUM.emit('order:created', { orderId: order.id, total: order.total, itemCount: items.length });
      NISUM.emit('notification:show', { message: `Order ${order.id} placed!`, level: 'success' });
    } catch {
      // `error` from useCheckout already reflects the failure in the UI below
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <h2>Your Cart</h2>
        <p>{confirmation ?? 'Your cart is empty. Add some products first!'}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Cart</h2>
      {items.map((item) => (
        <CartItemRow key={item.productId} item={item} highlighted={item.productId === highlighted} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0', fontSize: 18 }}>
        <strong>Total</strong>
        <strong>{formatCurrency(total)}</strong>
      </div>
      {!user && <ErrorPanel title="Login required" message="Log in from the header to check out." />}
      {error && <ErrorPanel message={error} />}
      <Button onClick={handleCheckout} disabled={!user || status === 'submitting'}>
        {status === 'submitting' ? 'Placing order...' : 'Checkout'}
      </Button>
    </div>
  );
}
