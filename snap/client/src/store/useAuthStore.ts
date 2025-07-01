

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
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
  initializeAuth: () => void;
  clearAuth: () => void;
}



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
            await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/v1/users/logout`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
          
        } catch (error) {
          console.error('Logout API call failed:', error);
        }

        get().clearAuth();
        set({ isLoading: false });
      },

     


      initializeAuth: async () => {
        // Prevent re-initialization if already done
        if (get().isInitialized) {
          return;
        }

        try {
          
          const response = await fetchUserProfile();
          if (response && response.data.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            // If the API call fails, the session is invalid.
            throw new Error("Invalid session.");
          }
        } catch (error) {
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
        Cookies.remove('user', { path: '/' });
        Cookies.remove('isAuthenticated', { path: '/' });

        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true, 
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


