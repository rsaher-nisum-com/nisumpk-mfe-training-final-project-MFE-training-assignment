// Ambient module declarations for the federated remotes consumed at runtime
// (see webpack.config.js `remotes`). These only exist for the TypeScript
// compiler / editor - webpack resolves the real modules over HTTP at
// runtime via the ModuleFederationPlugin runtime.
declare module 'mfeProduct/ProductApp' {
  import type { ComponentType } from 'react';
  const ProductApp: ComponentType;
  export default ProductApp;
}

declare module 'mfeCart/CartApp' {
  import type { ComponentType } from 'react';
  const CartApp: ComponentType;
  export default CartApp;
}

declare module 'mfeOrders/OrdersApp' {
  import type { ComponentType } from 'react';
  const OrdersApp: ComponentType;
  export default OrdersApp;
}
