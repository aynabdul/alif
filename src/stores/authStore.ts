import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api.service';


interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userCountry: string | null;
  
  // Auth actions
  register: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  setUserCountry: (country: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userCountry: null,
      
      // Customer registration
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signUp(name, email, password);
          
          if (response.status === 201) {
            // Registration successful, but user needs to sign in
            set({ isLoading: false });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          });
        }
      },
      
      // Customer login
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signIn(email, password);
          
          if (response.status === 200) {
            const user: User = {
              id: String(response.id || ''),
              name: response.name || '',
              email: response.email || '',
              country: get().userCountry,
            };
            
            set({ 
              user,
              token: response.token || null,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false
          });
        }
      },
      
      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          
          set({ 
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Logout failed',
            isLoading: false
          });
        }
      },
      
      // Reset password
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // await api.auth.resetPassword({ email });
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, we'll simulate a successful password reset
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password reset failed',
            isLoading: false
          });
        }
      },
      
      // Clear error message
      clearError: () => set({ error: null }),
      
      // Set user country
      setUserCountry: (country) => set({ userCountry: country }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 