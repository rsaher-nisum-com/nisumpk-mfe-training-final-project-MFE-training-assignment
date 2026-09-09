import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { addItem, clearCart, login, logout, store } from '@nisum-mfe/state';
import { NISUM } from '@nisum-mfe/events';
import App from '../App';

function renderApp() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('Cart MFE App', () => {
  beforeEach(() => {
    store.dispatch(clearCart());
    store.dispatch(logout());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('reads cart items from the shared Redux store', () => {
    store.dispatch(addItem({ productId: 'p1', name: 'Mug', price: 10 }));
    renderApp();
    expect(screen.getByTestId('cart-item-p1')).toBeInTheDocument();
    expect(screen.getByText('Mug')).toBeInTheDocument();
  });

  it('highlights a row when it receives a cart:item-added event', () => {
    store.dispatch(addItem({ productId: 'p1', name: 'Mug', price: 10 }));
    renderApp();

    act(() => {
      NISUM.emit('cart:item-added', { productId: 'p1', name: 'Mug', quantity: 1, price: 10 });
    });

    expect(screen.getByTestId('cart-item-p1')).toHaveClass('nisum-cart-item--highlighted');
  });

  it('shows a login prompt instead of allowing checkout when logged out', () => {
    store.dispatch(addItem({ productId: 'p1', name: 'Mug', price: 10 }));
    renderApp();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /checkout/i })).toBeDisabled();
  });

  it('checks out, clears the cart, and emits order:created', async () => {
    store.dispatch(login({ id: 'u1', name: 'Ava', email: 'ava@example.com' }));
    store.dispatch(addItem({ productId: 'p1', name: 'Mug', price: 10 }));

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'ord_1',
        userId: 'u1',
        items: [],
        total: 10,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }),
    }) as unknown as typeof fetch;

    const orderListener = vi.fn();
    const unsubscribe = NISUM.listener('order:created', orderListener);

    renderApp();
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

    await screen.findByText(/order ord_1 confirmed/i);
    expect(store.getState().cart.items).toHaveLength(0);
    expect(orderListener).toHaveBeenCalledWith({ orderId: 'ord_1', total: 10, itemCount: 1 });

    unsubscribe();
  });
});
