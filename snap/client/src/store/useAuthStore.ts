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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      logout: async () => {
        console.log('🚪 Starting logout process...');
        set({ isLoading: true });

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('📤 Logout response:', response.status);
        } catch (error) {
          console.error('❌ Logout API call failed:', error);
        }

        get().clearAuth();
        set({ isLoading: false });
        console.log('✅ Logout completed');
      },

      initializeAuth: async () => {
        console.log('🔄 Starting auth initialization...');
        const state = get();
        
        if (state.isInitialized) {
          console.log('✋ Auth already initialized, skipping');
          return;
        }

        set({ isLoading: true });

        try {
          console.log('📡 Fetching user profile...');
          const response = await fetchUserProfile();
          console.log('📥 Profile response:', response);
          
          if (response && response.data && response.data.user) {
            console.log('👤 Setting user data:', response.data.user);
            set({
              user: response.data.user,
              isAuthenticated: true,
              isInitialized: true,
              isLoading: false,
            });
            console.log('✅ Auth initialization successful');
          } else {
            console.log('❌ No valid user data in response');
            throw new Error("No valid session");
          }
        } catch (error) {
          console.error('❌ Auth initialization failed:', error);
          get().clearAuth();
        }
      },

      login: (user) => {
        console.log('🔐 Setting user in store:', user);
        set({
          user: user,
          isAuthenticated: true,
          isInitialized: true,
        });
        console.log('✅ User set in store');
      },

      clearAuth: () => {
        console.log('🧹 Clearing auth state...');
        
        // Clear the actual JWT cookie that your backend sets
        // Note: You can only clear the cookie if it's not httpOnly, 
        // but since yours is httpOnly, this won't work from client-side
        // The backend logout endpoint should handle clearing the httpOnly cookie
        
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isLoading: false,
        });
        
        console.log('✅ Auth state cleared');
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
  console.log('🔍 Handling signup success:', response);
  if (response?.status === 'success' && response?.data?.user) {
    const user = {
      _id: response.data.user._id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role || 'user'
    };
    
    console.log('👤 Processed user data:', user);
    loginStore(user);
    return true;
  }
  console.log('❌ Signup success handling failed - invalid response format');
  return false;
};

export const handleLoginSuccess = (response: any, loginStore: (user: User) => void) => {
  console.log('🔍 Handling login success:', response);
  if (response?.status === 'success' && response?.data?.user) {
    const user = {
      _id: response.data.user._id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role || 'user'
    };
    
    console.log('👤 Processed user data:', user);
    loginStore(user);
    return true;
  }
  console.log('❌ Login success handling failed - invalid response format');
  return false;
};
