import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setUser: (user: User) => void;
  clearAuthState: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const createCleanUser = (user: User): User => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// Helper function to make API calls
const makeAPICall = async (endpoint: string, options: RequestInit = {}) => {
  if (!API_URL) {
    throw new Error('API base URL not defined');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
  });

  return response;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      login: (user: User) => {
        const cleanUser = createCleanUser(user);
        set({
          user: cleanUser,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await makeAPICall('/api/v1/users/logout', {
            method: 'POST',
          });
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          get().clearAuthState();
          set({ isLoading: false });
        }
      },

      clearAuthState: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true,
        });
      },

      initializeAuth: async () => {
        // Prevent multiple simultaneous initializations
        if (get().isLoading || get().isInitialized) return;
        
        set({ isLoading: true });

        try {
          const response = await makeAPICall('/api/v1/users/getMe');

          if (response.status === 401) {
            get().clearAuthState();
            set({ isLoading: false });
            return;
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const user = data.user;

          if (!user) {
            console.log('No user returned from API');
            get().clearAuthState();
            set({ isLoading: false });
            return;
          }

          const cleanUser = createCleanUser(user);
          set({
            user: cleanUser,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });

        } catch (error) {
          console.error('Auth initialization failed:', error);
          get().clearAuthState();
          set({ isLoading: false });
        }
      },

      setUser: (user: User) => {
        const cleanUser = createCleanUser(user);
        set({ user: cleanUser });
      },
    }),
    {
      name: 'auth-storage',
    
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);