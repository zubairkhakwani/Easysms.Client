//React
import { createContext, useState, useEffect } from "react";

//Services
import TokenService from "../services/Token/TokenService";

import { getCurrentUser } from "../services/User/UserService";

import {
  isAuthenticated,
  isAdminUser,
} from "../services/User/CurrentUserService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuthenticated] = useState(false);
  const [isAdmin, setAdminUser] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setIsAuthenticated(isAuthenticated());
    setAdminUser(isAdminUser());

    const fetchCurrentUser = async () => {
      try {
        if (isAuthenticated()) {
          const res = await getCurrentUser();
          //console.log(res);
          setCurrentUser(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch current user data:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const login = async (token) => {
    TokenService.setToken(token);
    setIsAuthenticated(true);
    setAdminUser(isAdminUser());

    const res = await getCurrentUser();
    setCurrentUser(res.data);
  };

  const logout = () => {
    TokenService.removeToken();
    setIsAuthenticated(false);
    setAdminUser(isAdminUser());
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
        isAuth,
        isAdmin,
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
