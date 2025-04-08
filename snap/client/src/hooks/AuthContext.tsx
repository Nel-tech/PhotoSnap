'use client'
import React, { createContext, useState, useEffect, useContext } from "react";
import cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (token: string) => void;
    logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    // Check if the token exists in cookies when the app is loaded
    useEffect(() => {
        const token = cookie.get("token");

        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);

            // Decode the token and get user info
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        } else {
            setIsAuthenticated(false);
        }
    }, []); // Remove isAuthenticated from dependency array

    const login = (token: string) => {
        cookie.set("token", token, { expires: 7, path: "/" }); // Save token to cookies
        setIsAuthenticated(true);

        // Decode and set the user from the token
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
    };

    const logout = () => {
        cookie.remove("token"); // Remove token from cookies
        setIsAuthenticated(false);
        setUser(null);
    };

    // Utility function to check if the token has expired
    const isTokenExpired = (token: string): boolean => {
        try {
            const decodedToken: any = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                // Token is expired
                return true;
            }
            return false;
        } catch (e) {
            console.error("Error decoding token:", e);
            return true; // In case of error, consider the token expired
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};