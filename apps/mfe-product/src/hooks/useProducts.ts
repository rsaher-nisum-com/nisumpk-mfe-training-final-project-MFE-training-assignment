import { useCallback, useEffect, useState } from 'react';
import { fetchJson, readEnv } from '@nisum-mfe/utilities';
import type { Product } from '@nisum-mfe/shared-types';

export type FetchStatus = 'loading' | 'error' | 'success';

interface UseProductsResult {
  products: Product[];
  status: FetchStatus;
  error: string | null;
  reload: () => void;
}

/** Loads the product catalog from the backend, exposing loading/error/retry states. */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetchJson<Product[]>(`${readEnv('API_URL', 'http://localhost:4000')}/api/products`)
      .then((data) => {
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : []);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load products.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { products, status, error, reload };
}
