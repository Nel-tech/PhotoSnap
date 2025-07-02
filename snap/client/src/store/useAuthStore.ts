import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUserProfile } from '@/lib/api';

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
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearAuth: () => void;
}


const logError = (message: string, error?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  } else {
    console.warn('Authentication process encountered an issue');
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      logout: async () => {
        set({ isLoading: true });

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`Logout failed: ${response.status}`);
          }
        } catch (error) {
          logError('Logout API call failed', error);
         
        }

        get().clearAuth();
        set({ isLoading: false });
      },

      initializeAuth: async () => {
        const state = get();
        
        if (state.isInitialized) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetchUserProfile();
          
          if (response && response.data && response.data.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
            });
          } else {
            throw new Error("Invalid session response");
          }
        } catch (error) {
          logError('Auth initialization failed', error);
          get().clearAuth();
        }
      },

      login: (user) => {
        set({
          user: user,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export const handleSignupSuccess = (response: any, loginStore: (user: User) => void) => {

  if (response?.status === 'success' && response?.data?.user) {
    const user = {
      _id: response.data.user._id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role || 'user'
    };
    
    loginStore(user);
    return true;
  }
 
  return false;
};

export const handleLoginSuccess = (response: any, loginStore: (user: User) => void) => {

  if (response?.status === 'success' && response?.data?.user) {
    const user = {
      _id: response.data.user._id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role || 'user'
    };
    

    loginStore(user);
    return true;
  }
  return false;
};
