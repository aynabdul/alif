import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { Product } from '../types/api.types';

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: any; // We'll use any for image since it could be a require or uri
  categoryId?: string;
  currency?: string;
  type?: 'product' | 'qurbani';
};

interface CartState {
  items: CartItem[];
  country: string; // 'US' or 'PAK'
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      country: 'US', // Default to US
      
      addItem: (item) => set((state) => {
        // Ensure consistent id type by converting to string
        const itemId = String(item.id);
        
        // Check if item already exists
        const existingItemIndex = state.items.findIndex(i => String(i.id) === itemId);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          const updatedItems = [...state.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity,
          };
          
          return { items: updatedItems };
        } else {
          // Add new item
          return { items: [...state.items, {...item, id: itemId}] };
        }
      }),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(item => String(item.id) !== String(itemId)),
      })),
      
      updateQuantity: (itemId, quantity) => set((state) => {
        const itemIdStr = String(itemId);
        
        if (quantity <= 0) {
          return { items: state.items.filter(item => String(item.id) !== itemIdStr) };
        }
        
        return {
          items: state.items.map(item => 
            String(item.id) === itemIdStr
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