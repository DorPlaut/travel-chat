import { create } from 'zustand';

export const useDataStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  isLoadingProducts: true,
  setIsLoadingProducts: (isLoadingProducts) => set({ isLoadingProducts }),
}));
