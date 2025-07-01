'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

interface ProtectedProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const Protected = ({ children, allowedRoles = [] }: ProtectedProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const { user, isAuthenticated, isInitialized, initializeAuth } = useAuthStore();

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/unauthorized', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!isInitialized) {
            initializeAuth();
        }
    }, [isInitialized, initializeAuth]);

    useEffect(() => {
        if (isPublicRoute) {
            setIsReady(true);
            return;
        }

        if (!isInitialized) return;

        if (!isAuthenticated || !user) {
            router.replace("/login");
            return;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            router.replace("/unauthorized");
            return;
        }

        setIsReady(true);
    }, [isAuthenticated, user, isInitialized, allowedRoles, router, pathname, isPublicRoute]);

    if (!isReady && !isPublicRoute) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
                    <p className="text-gray-600">
                        {!isInitialized ? "Initializing..." : "Checking authentication..."}
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default Protected;