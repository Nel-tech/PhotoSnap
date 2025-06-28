import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
  setUser: (user: User) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user) => {
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    set({ user: cleanUser, isAuthenticated: true });
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      get().clearAuthState();
      set({ isLoading: false });
    }
  },

  clearAuthState: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initializeAuth: async () => {
    set({ isLoading: true });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/users/getMe`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch user');

      const data = await res.json();
      const user = data.user;

      const cleanUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      set({ user: cleanUser, isAuthenticated: true, isLoading: false });
    } catch (err) {
      console.error('❌ Auth init failed:', err);
      get().clearAuthState();
      set({ isLoading: false });
    }
  },

  setUser: (user) => {
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    set({ user: cleanUser });
  },
}));
