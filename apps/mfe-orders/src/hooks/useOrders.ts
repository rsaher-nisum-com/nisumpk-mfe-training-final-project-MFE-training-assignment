import { useCallback, useEffect, useState } from 'react';
import { fetchJson, readEnv } from '@nisum-mfe/utilities';
import type { Order } from '@nisum-mfe/shared-types';

export type FetchStatus = 'loading' | 'error' | 'success';

interface UseOrdersResult {
  orders: Order[];
  status: FetchStatus;
  error: string | null;
  reload: () => void;
}

/** Loads a user's order history. No-ops until a userId is available (logged out). */
export function useOrders(userId: string | undefined): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetchJson<Order[]>(
      `${readEnv('API_URL', 'http://localhost:4000')}/api/orders?userId=${encodeURIComponent(userId)}`,
    )
      .then((data) => {
        if (cancelled) return;
        setOrders(Array.isArray(data) ? data : []);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load orders.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { orders, status, error, reload };
}
