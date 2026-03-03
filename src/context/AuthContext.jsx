import { createContext, useState, useEffect } from "react";
import TokenService from "../services/Token/TokenService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(TokenService.isAuthenticated());
  }, []);

  const login = (token) => {
    TokenService.setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    TokenService.removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
