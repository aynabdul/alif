import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/api.types';

interface WishlistState {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product) => {
        const currentItems = get().items;
        const productIdStr = String(product.id);
        const isAlreadyInWishlist = currentItems.some(item => String(item.id) === productIdStr);
        
        if (!isAlreadyInWishlist) {
          set({ items: [...currentItems, product] });
        }
      },
      
      removeFromWishlist: (productId) => {
        const currentItems = get().items;
        const productIdStr = String(productId);
        set({ items: currentItems.filter(item => String(item.id) !== productIdStr) });
      },
      
      isInWishlist: (productId) => {
        const productIdStr = String(productId);
        return get().items.some(item => String(item.id) === productIdStr);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 