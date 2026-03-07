import { createContext, useState, useEffect } from "react";
import TokenService from "../services/Token/TokenService";
import { getCurrentUser } from "../services/User/UserService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminUser, setAdminUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setIsAuthenticated(TokenService.isAuthenticated());
    setAdminUser(TokenService.isAdminUser());

    const fetchCurrentUser = async () => {
      try {
        const res = await getCurrentUser();
        setCurrentUser(res.data);
      } catch (error) {
        console.error("Failed to fetch current user data:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = (token) => {
    TokenService.setToken(token);
    setIsAuthenticated(true);
    setAdminUser(TokenService.isAdminUser());
  };

  const logout = () => {
    TokenService.removeToken();
    setIsAuthenticated(false);
    setAdminUser(TokenService.isAdminUser());
  };

  const balanceCredit = (amount) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      balance: prevUser.balance + amount,
    }));
  };

  const balanceDebit = (amount) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      balance: prevUser.balance - amount,
    }));
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdminUser,
        currentUser,
        login,
        logout,
        balanceCredit,
        balanceDebit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
