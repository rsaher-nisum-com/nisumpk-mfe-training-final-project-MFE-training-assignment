import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@nisum-mfe/state';
import App from '../App';

// Mock the local `../remotes` module (not the bare `mfeProduct/ProductApp`
// style specifiers) - those only resolve at runtime via the webpack Module
// Federation runtime and can't be resolved by Vite's test bundler at all.
vi.mock('../remotes', () => ({
  ProductApp: () => <div>Product Catalog Page</div>,
  CartApp: () => <div>Cart Page</div>,
  OrdersApp: () => <div>Orders Page</div>,
}));

function renderApp() {
  window.history.pushState({}, '', '/');
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('Gateway shell', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the shell chrome and the default product route', async () => {
    renderApp();
    expect(screen.getByText('NISUM Shop')).toBeInTheDocument();
    expect(await screen.findByText('Product Catalog Page')).toBeInTheDocument();
  });

  it('navigates to the cart route via the nav bar', async () => {
    renderApp();
    await screen.findByText('Product Catalog Page');

    fireEvent.click(screen.getByRole('link', { name: /cart/i }));

    expect(await screen.findByText('Cart Page')).toBeInTheDocument();
  });

  it('navigates to the orders route via the nav bar', async () => {
    renderApp();
    await screen.findByText('Product Catalog Page');

    fireEvent.click(screen.getByRole('link', { name: /orders/i }));

    expect(await screen.findByText('Orders Page')).toBeInTheDocument();
  });
});
