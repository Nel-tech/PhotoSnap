'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const Protected = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return <p>Loading...</p>;
    }

    return <>{children}</>;
};

export default Protected;
