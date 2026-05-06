import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(email, password) {
        const { user } = await loginUser(email, password);
        setCurrentUser(user);
        return user;
    }

    async function logout() {
        await logoutUser();
        setCurrentUser(null);
    }

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch {
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const value = {
        currentUser,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
