import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { login, logout, store } from '@nisum-mfe/state';
import { NISUM } from '@nisum-mfe/events';
import App from '../App';

function renderApp() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

describe('Orders MFE App', () => {
  beforeEach(() => {
    store.dispatch(logout());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('prompts to log in when there is no user', () => {
    renderApp();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it('lists orders for the logged-in user', async () => {
    store.dispatch(login({ id: 'u1', name: 'Ava', email: 'ava@example.com' }));
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'ord_1', userId: 'u1', items: [{ productId: 'p1', name: 'Mug', price: 10, quantity: 1 }], total: 10, status: 'confirmed', createdAt: new Date().toISOString() },
      ],
    }) as unknown as typeof fetch;

    renderApp();
    expect(await screen.findByTestId('order-ord_1')).toBeInTheDocument();
  });

  it('refetches when it receives an order:created event', async () => {
    store.dispatch(login({ id: 'u1', name: 'Ava', email: 'ava@example.com' }));
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    global.fetch = fetchMock as unknown as typeof fetch;

    renderApp();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    act(() => {
      NISUM.emit('order:created', { orderId: 'ord_2', total: 5, itemCount: 1 });
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
