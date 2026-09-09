import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { createLogger } from '@nisum-mfe/utilities';

const logger = createLogger('gateway/remotes');

/**
 * Wraps each federated `import()` so a remote that is down (dev server not
 * running, bad deploy, network error) rejects loudly into the log and lets
 * the nearest RemoteBoundary's ErrorBoundary catch it, instead of an
 * unhandled rejection crashing the tab.
 */
function loadRemote<T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>,
  remoteName: string,
): LazyExoticComponent<T> {
  return lazy(() =>
    loader().catch((error: unknown) => {
      logger.error(`Failed to load remote "${remoteName}"`, { error: String(error) });
      throw error;
    }),
  );
}

export const ProductApp = loadRemote(() => import('mfeProduct/ProductApp'), 'mfeProduct');
export const CartApp = loadRemote(() => import('mfeCart/CartApp'), 'mfeCart');
export const OrdersApp = loadRemote(() => import('mfeOrders/OrdersApp'), 'mfeOrders');
