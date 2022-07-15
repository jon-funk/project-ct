import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { HasRefreshedAuthToken } from "../utils/api.js";

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const router = useRouter();

    // user is boolean for now since we are only retrieving an access token
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUserFromCookies() {
            const token = Cookies.get("auth-token");
            if (token) {
                const authenticated = await HasRefreshedAuthToken(token);
                if (authenticated) {
                    setUser(true);
                }
            }
            setLoading(false);
        }

        loadUserFromCookies();
    }, [])

    const logout = () => {
        Cookies.remove("auth-token");
        setUser(false);
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: user, user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function ProtectedRoute(Component) {
    return () => {
        const { isAuthenticated, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isAuthenticated && !loading) {
                router.push("/")
            }
        }, [loading, isAuthenticated]);

        return (<Component {...arguments} />)
    }
}

export default function useAuth() {
    const context = useContext(AuthContext);

    return context;
}