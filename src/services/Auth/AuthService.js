import httpClient from "../Base/HttpClient";

export const registerUser = async (data) => {
  const response = await httpClient.post("/api/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await httpClient.post("/api/auth/login", data);
  return response.data;
};
