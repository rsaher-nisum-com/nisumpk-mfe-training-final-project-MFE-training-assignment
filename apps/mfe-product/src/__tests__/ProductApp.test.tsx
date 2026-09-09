import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { clearCart, store } from '@nisum-mfe/state';
import { NISUM } from '@nisum-mfe/events';
import App from '../App';

const sampleProducts = [
  { id: 'p1', name: 'Mug', description: 'A mug', price: 9.99, category: 'Home', image: 'img.png', stock: 10 },
];

function renderApp() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('Product MFE App', () => {
  beforeEach(() => {
    store.dispatch(clearCart());
    window.localStorage.clear();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleProducts,
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders the product catalog from the API', async () => {
    renderApp();
    expect(await screen.findByText('Mug')).toBeInTheDocument();
  });

  it('dispatches addItem AND emits cart:item-added when "Add to cart" is clicked', async () => {
    const listener = vi.fn();
    const unsubscribe = NISUM.listener('cart:item-added', listener);

    renderApp();
    await screen.findByText('Mug');

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0]).toMatchObject({ productId: 'p1', quantity: 1 });
    expect(listener).toHaveBeenCalledWith({ productId: 'p1', name: 'Mug', quantity: 1, price: 9.99 });

    unsubscribe();
  });

  it('shows an error state with retry when the API call fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;
    renderApp();
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});
