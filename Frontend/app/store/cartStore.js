import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [], // [{id, name, price, image, qtyLabel, quantity}]

  addToCart: (product, quantity) => {
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
          price: product.price,
          image: product.image,
          qtyLabel: product.qtyLabel,
          quantity,
        },
      ],
    });
  },
}));
