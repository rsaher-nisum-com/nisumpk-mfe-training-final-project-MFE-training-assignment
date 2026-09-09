import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EventBus } from '../eventBus';

describe('EventBus (window.NISUM)', () => {
  let bus: EventBus;

  beforeEach(() => {
    bus = new EventBus(window);
  });

  it('delivers the payload to a registered listener', () => {
    const handler = vi.fn();
    bus.listener('cart:item-added', handler);

    bus.emit('cart:item-added', { productId: 'p1', name: 'Mug', quantity: 2, price: 9.99 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ productId: 'p1', name: 'Mug', quantity: 2, price: 9.99 });
  });

  it('supports multiple listeners for the same event', () => {
    const first = vi.fn();
    const second = vi.fn();
    bus.listener('order:created', first);
    bus.listener('order:created', second);

    bus.emit('order:created', { orderId: 'o1', total: 42, itemCount: 3 });

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not call a listener after it unsubscribes', () => {
    const handler = vi.fn();
    const unsubscribe = bus.listener('cart:item-removed', handler);

    unsubscribe();
    bus.emit('cart:item-removed', { productId: 'p1' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('does not deliver events emitted before a listener subscribes', () => {
    bus.emit('user:logout', {});
    const handler = vi.fn();
    bus.listener('user:logout', handler);

    expect(handler).not.toHaveBeenCalled();
  });

  it('keeps event payloads isolated per event name', () => {
    const cartHandler = vi.fn();
    const orderHandler = vi.fn();
    bus.listener('cart:updated', cartHandler);
    bus.listener('order:created', orderHandler);

    bus.emit('cart:updated', { totalItems: 3, totalPrice: 29.97 });

    expect(cartHandler).toHaveBeenCalledTimes(1);
    expect(orderHandler).not.toHaveBeenCalled();
  });
});
