import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { RemoteBoundary } from '../components/RemoteBoundary';
import { CartApp, OrdersApp, ProductApp } from '../remotes';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RemoteBoundary name="Product Catalog">
            <ProductApp />
          </RemoteBoundary>
        }
      />
      <Route
        path="/cart"
        element={
          <RemoteBoundary name="Cart">
            <CartApp />
          </RemoteBoundary>
        }
      />
      <Route
        path="/orders"
        element={
          <RemoteBoundary name="Orders">
            <OrdersApp />
          </RemoteBoundary>
        }
      />
    </Routes>
  );
}
