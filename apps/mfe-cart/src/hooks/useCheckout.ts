import { useState } from 'react';
import { fetchJson, readEnv } from '@nisum-mfe/utilities';
import type { CartItem, Order } from '@nisum-mfe/shared-types';

export type CheckoutStatus = 'idle' | 'submitting' | 'error';

interface UseCheckoutResult {
  submitOrder: (userId: string, items: CartItem[]) => Promise<Order>;
  status: CheckoutStatus;
  error: string | null;
}

/** Posts the current cart to the backend to create an order. */
export function useCheckout(): UseCheckoutResult {
  const [status, setStatus] = useState<CheckoutStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submitOrder(userId: string, items: CartItem[]): Promise<Order> {
    setStatus('submitting');
    setError(null);
    try {
      const order = await fetchJson<Order>(`${readEnv('API_URL', 'http://localhost:4000')}/api/orders`, {
        method: 'POST',
        body: JSON.stringify({ userId, items }),
      });
      setStatus('idle');
      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout failed.';
      setStatus('error');
      setError(message);
      throw err;
    }
  }

  return { submitOrder, status, error };
}
