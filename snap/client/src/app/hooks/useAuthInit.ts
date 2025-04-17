// app/useAuthInit.ts
'use client'
import { useEffect } from 'react';
import cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/store/useAuthStore';

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

export const useAuthInit = () => {
  const fetchUserProfile = useAuthStore((s) => s.fetchUserProfile);
  const setAuthState = useAuthStore((s) => s.setAuthState);

  useEffect(() => {
    const initAuth = async () => {
      const token = cookie.get('token');
      if (token && !isTokenExpired(token)) {
        console.log('Token is valid, fetching profile');
        const user = await fetchUserProfile(token); 
        setAuthState(true, user);  
      } else {
        console.log('No valid token found or token is expired');
        setAuthState(false, null);  
      }
    };

    initAuth(); // Run the initialization
  }, [fetchUserProfile, setAuthState]);
};
