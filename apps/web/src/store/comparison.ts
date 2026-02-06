import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComparisonProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  specs: Record<string, string | number | boolean>;
}

interface ComparisonState {
  products: ComparisonProduct[];
  isOpen: boolean;
  addProduct: (product: ComparisonProduct) => void;
  removeProduct: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
  toggleProduct: (product: ComparisonProduct) => void;
  openTray: () => void;
  closeTray: () => void;
}

const MAX_COMPARISON_ITEMS = 4;

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      products: [],
      isOpen: false,

      addProduct: (product) => {
        const { products } = get();
        if (products.length >= MAX_COMPARISON_ITEMS) return;
        if (products.some((p) => p.id === product.id)) return;
        set({ products: [...products, product], isOpen: true });
      },

      removeProduct: (id) => {
        const updated = get().products.filter((p) => p.id !== id);
        set({ products: updated, isOpen: updated.length > 0 });
      },

      clearComparison: () => set({ products: [], isOpen: false }),

      isInComparison: (id) => get().products.some((p) => p.id === id),

      toggleProduct: (product) => {
        const { products } = get();
        if (products.some((p) => p.id === product.id)) {
          get().removeProduct(product.id);
        } else {
          get().addProduct(product);
        }
      },

      openTray: () => set({ isOpen: true }),
      closeTray: () => set({ isOpen: false }),
    }),
    {
      name: "sonica-comparison",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
