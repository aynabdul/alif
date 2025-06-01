// src/stores/wishlistStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Qurbani } from '../types/api.types';

type WishlistItem = {
  type: 'product' | 'qurbani';
  data: Product | Qurbani;
};

interface WishlistState {
  items: WishlistItem[];
  addProductToWishlist: (product: Product) => void;
  addQurbaniToWishlist: (qurbani: Qurbani) => void;
  removeFromWishlist: (itemId: string | number) => void;
  isInWishlist: (itemId: string | number) => boolean;
  clearWishlist: () => void;
  getProducts: () => Product[];
  getQurbanis: () => Qurbani[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addProductToWishlist: (product) => {
        const currentItems = get().items;
        const productIdStr = String(product.id);
        const isAlreadyInWishlist = currentItems.some(
          item => String(item.data.id) === productIdStr && item.type === 'product'
        );
        
        if (!isAlreadyInWishlist) {
          set({ 
            items: [...currentItems, { type: 'product', data: product }] 
          });
        }
      },
      
      addQurbaniToWishlist: (qurbani) => {
        const currentItems = get().items;
        const qurbaniIdStr = String(qurbani.id);
        const isAlreadyInWishlist = currentItems.some(
          item => String(item.data.id) === qurbaniIdStr && item.type === 'qurbani'
        );
        
        if (!isAlreadyInWishlist) {
          set({ 
            items: [...currentItems, { type: 'qurbani', data: qurbani }] 
          });
        }
      },
      
      removeFromWishlist: (itemId) => {
        const currentItems = get().items;
        const itemIdStr = String(itemId);
        set({ 
          items: currentItems.filter(item => String(item.data.id) !== itemIdStr) 
        });
      },
      
      isInWishlist: (itemId) => {
        const itemIdStr = String(itemId);
        return get().items.some(item => String(item.data.id) === itemIdStr);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
      
      getProducts: () => {
        return get().items
          .filter(item => item.type === 'product')
          .map(item => item.data as Product);
      },
      
      getQurbanis: () => {
        return get().items
          .filter(item => item.type === 'qurbani')
          .map(item => item.data as Qurbani);
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);