//Services
import { TOKEN_KEY } from "../../data/Static";

//Package that helps us decode jwt token
import { jwtDecode } from "jwt-decode";

export const getCurrentUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) null;

  try {
    const decoded = jwtDecode(token);
    let currentUser = {
      id: decoded.Id,
      name: decoded.unique_name,
      email: decoded.email,
      role: decoded.role,
    };

    return currentUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

export const isAdminUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === "Admin";
  } catch {
    return false;
  }
};
