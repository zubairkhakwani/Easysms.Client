import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

const TokenService = {
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  isAdminUser: () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.role === "Admin";
    } catch {
      return false;
    }
  },
};

export default TokenService;
