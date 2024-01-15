import { createContext } from "react";

interface AuthContextInterface {
  isAuthenticated: boolean;
  user: boolean;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
  isAuthenticated: false,
  user: false,
  loading: false,
  logout: () => {},
});
