import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: {},

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart[product._id];
      return {
        cart: {
          ...state.cart,
          [product._id]: {
            product,
            quantity: existing ? existing.quantity + 1 : 1,
          },
        },
      };
    });
  },

  removeFromCart: (id) =>
    set((state) => {
      const updated = { ...state.cart };
      delete updated[id];
      return { cart: updated };
    }),

  updateQuantity: (id, qty) =>
    set((state) => {
      if (qty <= 0) {
        const updated = { ...state.cart };
        delete updated[id];
        return { cart: updated };
      }
      if (!state.cart[id]) return state;
      return {
        cart: {
          ...state.cart,
          [id]: { ...state.cart[id], quantity: qty },
        },
      };
    }),

  clearCart: () => set({ cart: {} }),
}));

export default useCartStore;
