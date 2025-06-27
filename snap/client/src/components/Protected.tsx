'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const Protected = ({ children, allowedRoles = [] }: ProtectedProps) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const initializeAuth = useAuthStore((state) => state.initializeAuth);

    useEffect(() => {

        initializeAuth();
        setIsInitialized(true);
    }, [initializeAuth]);

    // Handle redirects after initialization
    useEffect(() => {
        if (!isInitialized) return;

        const hasNoAccess =
            !isAuthenticated ||
            !user ||
            (allowedRoles.length > 0 && !allowedRoles.includes(user.role));

        if (hasNoAccess) {
            router.push("/unauthorized");
        } 
    }, [isInitialized, isAuthenticated, user, allowedRoles, router]);

    // Show loading while initializing
    if (!isInitialized) {
        return (
            <div className="flex flex-col items-center justify-center h-60">
                <Loader2 className="h-8 w-8 text-gray-500 mb-2 animate-spin" />
                <p>Loading Please Wait...</p>
            </div>
        );
    }

    // Check access before rendering
    const hasNoAccess =
        !isAuthenticated ||
        !user ||
        (allowedRoles.length > 0 && !allowedRoles.includes(user.role));

    if (hasNoAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-60">
                <Loader2 className="h-8 w-8 text-gray-500 mb-2 animate-spin" />
                <p>Redirecting...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default Protected;