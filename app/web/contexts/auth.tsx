import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { HasRefreshedAuthToken } from "../utils/api";
import { AuthContext } from "../interfaces/AuthContextInterface";

/**
 * Provides authentication context and manages user authentication state.
 *
 * @param The child components to be wrapped by the AuthProvider.
 *
 * @returns The wrapped components with authentication context.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
        console.log("auth token was not retrieved from local storage");
      }
      setLoading(false);
    }

    verifyAuthToken();
  }, []);

  const logout = () => {
    window.localStorage.removeItem("auth-token");
    setUser(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: user, user, loading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Higher-order component that protects a route by checking if the user is authenticated.
 *
 * @param Component - The component to be rendered.
 *
 * @returns The protected component.
 */
export function ProtectedRoute(Component: React.ComponentType) {
  const WrappedComponent = (props: Record<string, unknown>) => {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
      if (!isAuthenticated && !loading) {
        // User is trying to access authenticated route without credentials
        window.location.pathname = "/";
      }
    }, [isAuthenticated, loading]);

    return <Component {...props} />;
  };

  // Assign a display name for debugging purposes
  WrappedComponent.displayName = `ProtectedRoute(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
}

/**
 * Custom hook that provides access to the authentication context.
 *
 * @returns The authentication context object.
 */
export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

/**
 * Retrieves the authentication token from the local storage and formats it as a Bearer token.
 *
 * @returns Formatted authentication token.
 */
export function useAuthToken() {
  return `Bearer ${window.localStorage.getItem("auth-token")}`;
}
