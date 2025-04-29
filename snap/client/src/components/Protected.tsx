'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import cookie from 'js-cookie';
import { Loader2 } from "lucide-react";

interface ProtectedProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const Protected = ({ children, allowedRoles = [] }: ProtectedProps) => {
    const [hasMounted, setHasMounted] = useState(false); // Ensures no SSR mismatch
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true); // Mark component as mounted on client

        const checkAuth = async () => {
            const token = cookie.get("token");

            if (token) {
                await login(token);
            }

            const noAccess =
                !token ||
                !isAuthenticated ||
                (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role)));

            if (noAccess) {
                router.push("/unauthorized");
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, isAuthenticated, login, user, allowedRoles]);

    if (!hasMounted || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-60">
                <Loader2 className="h-8 w-8 text-gray-500 mb-2 animate-spin" />
                <p className="text-sm text-gray-500">Loading please wait...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default Protected;
