import { describe, expect, it } from 'vitest';
import cartReducer, {
  addItem,
  clearCart,
  removeItem,
  selectCartTotalItems,
  selectCartTotalPrice,
  updateQuantity,
  type CartState,
} from '../cartSlice';

const empty: CartState = { items: [] };

describe('cartSlice reducer', () => {
  it('adds a new item', () => {
    const state = cartReducer(empty, addItem({ productId: 'p1', name: 'Mug', price: 9.99 }));
    expect(state.items).toEqual([{ productId: 'p1', name: 'Mug', price: 9.99, quantity: 1, image: undefined }]);
  });

  it('increments quantity when the same product is added again', () => {
    let state = cartReducer(empty, addItem({ productId: 'p1', name: 'Mug', price: 9.99 }));
    state = cartReducer(state, addItem({ productId: 'p1', name: 'Mug', price: 9.99, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('removes an item by productId', () => {
    let state = cartReducer(empty, addItem({ productId: 'p1', name: 'Mug', price: 9.99 }));
    state = cartReducer(state, removeItem({ productId: 'p1' }));
    expect(state.items).toHaveLength(0);
  });

  it('updates quantity, clamped to a minimum of 1', () => {
    let state = cartReducer(empty, addItem({ productId: 'p1', name: 'Mug', price: 9.99 }));
    state = cartReducer(state, updateQuantity({ productId: 'p1', quantity: 0 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clears the cart', () => {
    let state = cartReducer(empty, addItem({ productId: 'p1', name: 'Mug', price: 9.99 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });
});

describe('cartSlice selectors', () => {
  const state = {
    cart: {
      items: [
        { productId: 'p1', name: 'Mug', price: 10, quantity: 2 },
        { productId: 'p2', name: 'Pen', price: 5, quantity: 3 },
      ],
    },
  };

  it('computes total item count', () => {
    expect(selectCartTotalItems(state)).toBe(5);
  });

  it('computes total price', () => {
    expect(selectCartTotalPrice(state)).toBe(35);
  });
});
