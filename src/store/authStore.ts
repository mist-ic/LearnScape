import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  preferences: {
    emailNotifications: boolean;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        // In a real app, this would make an API call
        // For demo purposes, we'll simulate a successful login
        set({
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
            createdAt: new Date().toISOString(),
            preferences: {
              emailNotifications: true,
            },
          },
          isAuthenticated: true,
        });
      },
      register: async (email: string, password: string, name: string) => {
        // In a real app, this would make an API call
        // For demo purposes, we'll simulate a successful registration
        set({
          user: {
            id: '1',
            email,
            name,
            createdAt: new Date().toISOString(),
            preferences: {
              emailNotifications: true,
            },
          },
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
      updatePreferences: (preferences) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...preferences },
              }
            : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);