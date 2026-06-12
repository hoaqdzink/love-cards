import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AddToCartResult = 'added' | 'duplicate' | 'max';

const MAX_CART_ITEMS = 20;

type CartState = {
  items: string[];
  addItem: (templateId: string) => AddToCartResult;
  removeItem: (templateId: string) => void;
  clearCart: () => void;
  getCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (templateId) => {
        const state = get();
        if (state.items.includes(templateId)) {
          return 'duplicate';
        }
        if (state.items.length >= MAX_CART_ITEMS) {
          return 'max';
        }
        set({ items: [...state.items, templateId] });
        return 'added';
      },
      removeItem: (templateId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== templateId),
        })),
      clearCart: () => set({ items: [] }),
      getCount: () => get().items.length,
    }),
    { name: 'lc_cart' }
  )
);
