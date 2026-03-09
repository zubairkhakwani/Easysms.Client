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

export default httpClient;
