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
  resetPasswordEmail: string | null;
  resetCodeVerified: boolean;
  
  // Auth actions
  register: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  setNewPassword: (email: string, newPassword: string) => Promise<void>;
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
      resetPasswordEmail: null,
      resetCodeVerified: false,
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signUp(name, email, password);
          
          if (response.status === 201) {
            set({ isLoading: false });
          } else {
            throw new Error(response.message || 'Registration failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ 
            error: errorMessage,
            isLoading: false
          });
          throw new Error(errorMessage); 
        }
      },
      
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
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage,
            isLoading: false
          });
          throw new Error(errorMessage); 
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
          const response = await authService.resetPassword(email);
          
          if (response.status === 200) {
            set({ 
              isLoading: false,
              resetPasswordEmail: email,
              resetCodeVerified: false
            });
          } else {
            throw new Error(response.message || 'Password reset failed');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password reset failed',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Verify reset code
      verifyResetCode: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.verifyResetCode(email, code);
          
          if (response.status === 200) {
            set({ 
              isLoading: false,
              resetCodeVerified: true
            });
          } else {
            throw new Error(response.message || 'Reset code verification failed');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Reset code verification failed',
            isLoading: false
          });
          throw error;
        }
      },
      
      // Set new password
      setNewPassword: async (email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.setNewPassword(email, newPassword);
          
          if (response.status === 200) {
            set({ isLoading: false });
          } else {
            throw new Error(response.message || 'Password set failed');
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password set failed',
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