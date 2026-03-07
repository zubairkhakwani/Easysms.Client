//Services
import { TOKEN_KEY } from "../../data/Static";

const TokenService = {
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
};

export default TokenService;
