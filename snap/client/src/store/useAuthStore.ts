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
  jwt: string | null; 
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, jwt?: string) => void; 
  logout: () => void;
  initializeAuth: () => void;
  setUser: (user: User) => void;
  clearAuthState: () => void; 
}

const COOKIE_OPTIONS = {
  expires: 7,
  path: '/',
  sameSite: 'lax' as const
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  jwt: null, 
  isAuthenticated: false,
  isLoading: false,

  login: (user, jwt) => {
   
    
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    
    Cookies.set('user', JSON.stringify(cleanUser), COOKIE_OPTIONS);
    Cookies.set('isAuthenticated', 'true', COOKIE_OPTIONS);
    
    
    if (jwt) {
      Cookies.set('jwt', jwt, COOKIE_OPTIONS);
    }
    
    set({ 
      user: cleanUser, 
      jwt: jwt || null, 
      isAuthenticated: true 
    });
  },

  logout: async () => {
   
    
    set({ isLoading: true });
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      get().clearAuthState();
      set({ isLoading: false });
    }
  },

  clearAuthState: () => {
    Cookies.remove('user', { path: '/' });
    Cookies.remove('jwt', { path: '/' }); 
    Cookies.remove('isAuthenticated', { path: '/' });
    
    
    set({ 
      user: null, 
      jwt: null, 
      isAuthenticated: false, 
      isLoading: false 
    });
  },

  initializeAuth: () => {
    const userCookie = Cookies.get('user');
    const jwtCookie = Cookies.get('jwt'); 
    const isAuthCookie = Cookies.get('isAuthenticated');
    if (userCookie && isAuthCookie === 'true') {
      try {
        const user = JSON.parse(userCookie);
        set({ 
          user, 
          jwt: jwtCookie || null, 
          isAuthenticated: true 
        });
      } catch (err) {
        console.error('❌ Failed to parse user cookie:', err);
        get().clearAuthState();
      }
    } else {
      set({ 
        user: null, 
        jwt: null, 
        isAuthenticated: false 
      });
    }
  },

  setUser: (user) => {
    const cleanUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    // Update cookie and state
    Cookies.set('user', JSON.stringify(cleanUser), COOKIE_OPTIONS);
    set({ user: cleanUser });
  },
}));