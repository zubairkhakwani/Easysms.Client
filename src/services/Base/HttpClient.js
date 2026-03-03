import axios from "axios";
import TokenService from "../Token/TokenService";

const httpClient = axios.create({
  baseURL: "https://localhost:7265/api",
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

export default httpClient;
