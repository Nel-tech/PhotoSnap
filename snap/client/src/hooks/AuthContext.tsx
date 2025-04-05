'use client'
import React, { createContext, useState, useEffect, useContext } from "react";
import cookie from "js-cookie";

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    // Check if the token exists in cookies when the app is loaded
    useEffect(() => {
        const token = cookie.get("token");

        if (token) {
            setIsAuthenticated(true);

            // You can decode the token here and get user info if needed
            const decodedUser = decodeToken(token); 
            setUser(decodedUser);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (token: string) => {
        cookie.set("token", token, { expires: 7, path: "/" }); // Save token to cookies
        setIsAuthenticated(true);

        // Decode and set the user from the token
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
    };

    const logout = () => {
        cookie.remove("token"); // Remove token from cookies
        setIsAuthenticated(false);
        setUser(null);
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

// A simple function to decode the JWT token (you can customize this to suit your token structure)
function decodeToken(token: string) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Invalid token:", e);
        return null;
    }
}
