import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@nisum-mfe/state';
import App from '../App';

vi.mock('mfeProduct/ProductApp', () => ({
  default: () => <div>Product Catalog Page</div>,
}));
vi.mock('mfeCart/CartApp', () => ({
  default: () => <div>Cart Page</div>,
}));
vi.mock('mfeOrders/OrdersApp', () => ({
  default: () => <div>Orders Page</div>,
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
