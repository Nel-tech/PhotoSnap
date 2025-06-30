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
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  clearAuth: () => void;
  getToken: () => string | null;
}

const COOKIE_OPTIONS = {
  expires: 100,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production'
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user, token) => {
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Store user data and token in cookies
    Cookies.set('user', JSON.stringify(cleanUser), COOKIE_OPTIONS);
    Cookies.set('jwt', token, COOKIE_OPTIONS);
    Cookies.set('isAuthenticated', 'true', COOKIE_OPTIONS);

    set({ user: cleanUser, isAuthenticated: true });
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      const token = get().getToken();
      
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }

    get().clearAuth();
    set({ isLoading: false });
  },

  clearAuth: () => {
    // Remove all auth-related cookies
    Cookies.remove('user', { path: '/' });
    Cookies.remove('isAuthenticated', { path: '/' });
    Cookies.remove('jwt', { path: '/' });

    set({ user: null, isAuthenticated: false });
  },

  getToken: () => {
    return Cookies.get('jwt') || null;
  },

  initializeAuth: () => {
    try {
      const userCookie = Cookies.get('user');
      const isAuthCookie = Cookies.get('isAuthenticated');
      const jwtCookie = Cookies.get('jwt');

     
      if (userCookie && isAuthCookie === 'true' && jwtCookie) {
        const user = JSON.parse(userCookie);
        set({ user, isAuthenticated: true });
      } else {

        get().clearAuth();
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      get().clearAuth();
    }
  }
}));