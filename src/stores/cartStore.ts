// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { Product } from '../types/api.types';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: any;
  categoryId?: string;
  currency?: string;
  type?: 'product' | 'qurbani';
  day?: string;
  hour?: string;
};

interface CartState {
  items: CartItem[];
  country: string;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  generateCartItemId: (item: CartItem) => string; // New function
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      country: 'US',
      
      generateCartItemId: (item: CartItem) => {
        if (item.type === 'qurbani' && item.day) {
          // For Qurbani items, create a composite ID with id, day, and hour (if present)
          return `${item.id}_${item.day}${item.hour ? `_${item.hour}` : ''}`;
        }
        // For non-Qurbani items, use the original ID
        return String(item.id);
      },

      addItem: (item) => set((state) => {
        // Generate composite ID
        const itemId = get().generateCartItemId(item);
        
        // Check if item already exists
        const existingItemIndex = state.items.findIndex(i => get().generateCartItemId(i) === itemId);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity,
          };
          
          return { items: updatedItems };
        } else {
          // Add new item with composite ID
          return { items: [...state.items, { ...item, id: itemId }] };
        }
      }),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => get().generateCartItemId(item) !== String(itemId)),
      })),
      
      updateQuantity: (itemId, quantity) => set((state) => {
        const itemIdStr = String(itemId);
        
        if (quantity <= 0) {
          return { items: state.items.filter(item => get().generateCartItemId(item) !== itemIdStr) };
        }
        
        return {
          items: state.items.map(item => 
            get().generateCartItemId(item) === itemIdStr
              ? { ...item, quantity }
              : item
          ),
        };
      }),
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'animal-farm-cart',
      storage: createJSONStorage(() => storage),
    }
  )
);