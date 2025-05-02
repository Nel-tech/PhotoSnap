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
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        setHasMounted(true);

        const checkAuth = async () => {
            const token = cookie.get("token");

            if (token && !useAuthStore.getState().isAuthenticated) {
                await login(token);
            }

            const user = useAuthStore.getState().user;
            const isAuthenticated = useAuthStore.getState().isAuthenticated;

            const noAccess =
                !token ||
                !isAuthenticated ||
                !user ||
                (allowedRoles.length > 0 && !allowedRoles.includes(user.role));

            if (noAccess) {
                router.push("/unauthorized");
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    },);

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
