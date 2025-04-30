// store/useAuthStore.ts
import { create } from 'zustand';
import cookie from 'js-cookie';

type UserRole = 'user' | 'admin';

interface User {
  _id: string;
  email: string;
  username?: string;
  name:string;
  role: UserRole;
  // Add other user fields as needed
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
 login: (token: string) => Promise<void>;
  logout: () => void;
 fetchUserProfile: (token: string) => Promise<User | null>;
  setAuthState: (authState: boolean, user: User | null) => void;
}


const loadInitialState = () => {
  try {
    const storedUser = cookie.get('user');
    const token = cookie.get('token');
    
   
    if (storedUser && token) {
      return { isAuthenticated: true, user: JSON.parse(storedUser) };
    }

    return { isAuthenticated: false, user: null };
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

  fetchUserProfile: async (token: string): Promise<User | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/users/getMe`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch user profile');

    const { data } = await res.json();

    cookie.set('user', JSON.stringify(data.user), { expires: 7, path: '/' });
    set({ user: data.user, isAuthenticated: true });
    return data.user; // ✅ RETURN USER
  } catch (err) {
    console.error('Error fetching user profile:', err);
    cookie.remove('user');
    cookie.remove('token');
    set({ user: null, isAuthenticated: false });
    return null; // ✅ RETURN NULL on failure
  }
},


login: async (token: string) => {
  cookie.set('token', token, { expires: 7, path: '/' });
  await useAuthStore.getState().fetchUserProfile(token);
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
