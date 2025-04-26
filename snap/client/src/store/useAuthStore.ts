// store/useAuthStore.ts
import { create } from 'zustand';
import cookie from 'js-cookie';

type UserRole = 'user' | 'admin';


interface User {
  _id: string;
  email: string;
  username?: string;
  role: UserRole;
  // Add other user fields as needed
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  fetchUserProfile: (token: string) => Promise<void>;
  setAuthState: (authState: boolean, user: User | null) => void;
}

// Load initial state from cookies
const loadInitialState = () => {
  try {
    const storedUser = cookie.get('user');
    return {
      isAuthenticated: !!storedUser,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  } catch (error) {
    console.error('Error loading initial state:', error);
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  ...loadInitialState(),

  fetchUserProfile: async (token: string) => {
    try {
      console.log('Fetching user profile with token:', token);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/users/getMe`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch user profile');

      const { data } = await res.json();
      console.log('User profile data:', data);

      // Store user data in cookie
      cookie.set('user', JSON.stringify(data.user), { expires: 7, path: '/' });
      
      set({ user: data.user, isAuthenticated: true });
    } catch (err) {
      console.error('Error fetching user profile:', err);
      cookie.remove('user');
      set({ user: null, isAuthenticated: false });
    }
  },

  login: (token: string) => {
    console.log('Login called with token:', token);
    cookie.set('token', token, { expires: 7, path: '/' });
    const store = useAuthStore.getState();
    store.fetchUserProfile(token);
  },

  logout: () => {
    console.log('Logout called');
    cookie.remove('token');
    cookie.remove('user');
    set({ user: null, isAuthenticated: false });
  },

  setAuthState: (authState: boolean, user: User | null) => {
    if (user) {
      cookie.set('user', JSON.stringify(user), { expires: 7, path: '/' });
    } else {
      cookie.remove('user');
    }
    set({ isAuthenticated: authState, user });
  }
}));
