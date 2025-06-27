import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useAuthRedirect = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const redirectTo = searchParams.get('redirectTo');
    
    // Function to get auth URLs with redirectTo preserved
    const getAuthUrls = useCallback(() => {
        const loginUrl = redirectTo 
            ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
            : '/login';
            
        const signupUrl = redirectTo 
            ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}`
            : '/signup';
            
        return { loginUrl, signupUrl };
    }, [redirectTo]);
    
    
    const handleAuthSuccess = useCallback(() => {
        const destination = redirectTo || '/';
        router.push(destination);
    }, [redirectTo, router]);
    
    
    const redirectToAuth = useCallback((targetPath: string) => {
        const loginUrl = `/login?redirectTo=${encodeURIComponent(targetPath)}`;
        router.push(loginUrl);
    }, [router]);
    
    return {
        redirectTo,
        getAuthUrls,
        handleAuthSuccess,
        redirectToAuth
    };
};