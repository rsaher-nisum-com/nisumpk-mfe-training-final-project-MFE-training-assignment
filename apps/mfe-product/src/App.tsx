import React from 'react';
import { ErrorPanel, LoadingPanel } from '@nisum-mfe/shared-ui';
import { useProducts } from './hooks/useProducts';
import { ProductList } from './components/ProductList';
import { Recommendations } from './components/Recommendations';

/**
 * This is the module exposed to the gateway as `mfeProduct/ProductApp`
 * (see webpack.config.js `exposes`). It is a plain component with no
 * <Provider>/root of its own so it renders inside the gateway's existing
 * React tree and shares its Redux context - see src/bootstrap.tsx for the
 * standalone-only wrapper used when this app runs on its own.
 */
export default function App() {
  const { products, status, error, reload } = useProducts();

  return (
    <div>
      <h2>Product Catalog</h2>
      {status === 'loading' && <LoadingPanel label="Loading products..." />}
      {status === 'error' && <ErrorPanel message={error ?? 'Failed to load products.'} onRetry={reload} />}
      {status === 'success' && (
        <>
          <ProductList products={products} />
          <Recommendations products={products} />
        </>
      )}
    </div>
  );
}
