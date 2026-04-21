//React
import { createContext, useState, useEffect } from "react";

//Services
import TokenService from "../services/Token/TokenService";

import { getCurrentUser } from "../services/User/UserService";

import {
  isAuthenticatedUser,
  isAuthorizedUser,
} from "../services/Auth/AuthService";

//Toaster
import { errorToast } from "../helper/Toaster";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setAuthorizedUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setIsAuthenticated(isAuthenticatedUser());
    setAuthorizedUser(isAuthorizedUser());

    const fetchCurrentUser = async () => {
      try {
        if (isAuthenticatedUser()) {
          const res = await getCurrentUser();
          setCurrentUser(res.data);
        }
      } catch {
        errorToast("Failed to fetch your data, please try later.");
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async (token) => {
    TokenService.setToken(token);
    setIsAuthenticated(true);
    setAuthorizedUser(isAuthorizedUser());

    const res = await getCurrentUser();
    setCurrentUser(res.data);
  };

  const logout = () => {
    TokenService.removeToken();
    setIsAuthenticated(false);
    setAuthorizedUser(isAuthorizedUser());
    setCurrentUser(null);
  };

  const balanceCredit = (amount) => {
    setCurrentUser((prevUser) => {
      if (prevUser?.balance == null) return prevUser;
      return {
        ...prevUser,
        balance: prevUser.balance + amount,
      };
    });
  };

  const balanceDebit = (amount) => {
    setCurrentUser((prevUser) => {
      if (prevUser?.balance == null) return prevUser;

      return {
        ...prevUser,
        balance: prevUser.balance - amount,
      };
    });
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthorized,
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
