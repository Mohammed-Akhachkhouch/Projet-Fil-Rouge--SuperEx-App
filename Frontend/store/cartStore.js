import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [], 

  addToCart: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);

    if (existing) {
      const updated = items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
      );
      return set({ items: updated });
    }

    set({
      items: [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          qtyLabel: product.qtyLabel || product.qty || '',
          quantity,
        },
      ],
    });
  },

  removeFromCart: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },

  setQuantity: (id, quantity) => {
    const q = Math.max(1, quantity);
    const updated = get().items.map((i) =>
      i.id === id ? { ...i, quantity: q } : i
    );
    set({ items: updated });
  },

  clearCart: () => set({ items: [] }),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
}));
