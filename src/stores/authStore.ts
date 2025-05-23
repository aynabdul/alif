// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api.service';
import { handleUnauthorized } from '../utils/authUtils';

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
  forgetPassword: (email: string) => Promise<void>;
  verifyOtpCode: (email: string, code: string) => Promise<void>;
  changePassword: (email: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  setUserCountry: (country: string) => void;
  handleUnauthorized: () => Promise<void>;
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
          set({ error: errorMessage, isLoading: false });
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
              resetPasswordEmail: null, // Clear reset state on login
              resetCodeVerified: false,
            });
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            resetPasswordEmail: null,
            resetCodeVerified: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Logout failed',
            isLoading: false,
          });
        }
      },

      forgetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.forgetPassword(email);
          if (response.status === 200) {
            set({
              isLoading: false,
              resetPasswordEmail: email,
              resetCodeVerified: false,
              isAuthenticated: false, // Ensure user is not authenticated
            });
          } else {
            throw new Error(response.message || 'Failed to send reset code');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to send reset code';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      verifyOtpCode: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.verifyOtpCode(email, code);
          if (response.status === 200) {
            set({
              isLoading: false,
              resetCodeVerified: true,
              isAuthenticated: false,
              token: null, // Clear any existing token
              user: null, // Clear any existing user data
            });
          } else {
            throw new Error(response.message || 'OTP verification failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'OTP verification failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      changePassword: async (email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.changePassword(email, newPassword);
          if (response.status === 200) {
            set({
              isLoading: false,
              resetPasswordEmail: null,
              resetCodeVerified: false,
              isAuthenticated: false, // Ensure user is not authenticated
            });
          } else {
            throw new Error(response.message || 'Password change failed');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Password change failed';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      clearError: () => set({ error: null }),

      setUserCountry: (country) => set({ userCountry: country }),

      handleUnauthorized: async () => {
        await handleUnauthorized();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          resetPasswordEmail: null,
          resetCodeVerified: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);