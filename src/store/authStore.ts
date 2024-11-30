import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate a successful login
    set({
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
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
}));