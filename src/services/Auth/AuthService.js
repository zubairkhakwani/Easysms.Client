import httpClient from "../Base/HttpClient";

export const registerUser = async (data) => {
  const response = await httpClient.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await httpClient.post("/auth/login", data);
  return response.data;
};
