//React
import axios from "axios";

//Services
import TokenService from "../Token/TokenService";
import { Base_Url } from "../../data/Static";

const httpClient = axios.create({
  baseURL: Base_Url,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
httpClient.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle responses globally
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      //TokenService.removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default httpClient;
