import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { HasRefreshedAuthToken } from "../utils/api";

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const router = useRouter();

    // user is boolean for now since we are only retrieving an access token
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function verifyAuthToken() {
            if (window.localStorage.getItem("auth-token")) {
                const token = `Bearer ${window.localStorage.getItem("auth-token")}`;
                const authenticated = await HasRefreshedAuthToken(token);
                if (authenticated) {
                    setUser(true);
                }
            } else {
                console.log("auth token was not retrieved from local storage")
            }
            setLoading(false);
        }

        verifyAuthToken();
    }, [])

    const logout = () => {
        window.localStorage.removeItem("auth-token");
        setUser(false);
        router.push("/");
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
                // User is trying to access authenticated route without credentials
                window.location.pathname = "/";
                // router.push("/");
            }
        }, [loading, isAuthenticated]);

        return (<Component {...arguments} />)
    }
}

export default function useAuth() {
    const context = useContext(AuthContext);

    return context;
}