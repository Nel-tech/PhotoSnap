import { create } from 'zustand';
import Cookies from 'js-cookie';

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
  logout: () => Promise<void>;
  initializeAuth: () => void;
  clearAuth: () => void;
}

const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user) => {
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    Cookies.set('user', JSON.stringify(cleanUser), COOKIE_OPTIONS);
    Cookies.set('isAuthenticated', 'true', COOKIE_OPTIONS);
    
    set({ user: cleanUser, isAuthenticated: true });
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    
    get().clearAuth();
    set({ isLoading: false });
  },

  clearAuth: () => {
    Cookies.remove('user', { path: '/' });
    Cookies.remove('isAuthenticated', { path: '/' });
    set({ user: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    try {
      const userCookie = Cookies.get('user');
      const isAuthCookie = Cookies.get('isAuthenticated');
      
      if (userCookie && isAuthCookie === 'true') {
        const user = JSON.parse(userCookie);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      get().clearAuth();
    }
  }
}));