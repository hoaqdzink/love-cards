import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
  items: string[];
  addItem: (templateId: string) => void;
  removeItem: (templateId: string) => void;
  clearCart: () => void;
  getCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (templateId) =>
        set((state) => ({
          items: state.items.includes(templateId)
            ? state.items
            : [...state.items, templateId],
        })),
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
