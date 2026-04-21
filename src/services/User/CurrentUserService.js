//Package that helps us decode jwt token
import { jwtDecode } from "jwt-decode";

//Services
import TokenService from "../../services/Token/TokenService";

export const getCurrentUser = () => {
  const token = TokenService.getToken();
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


