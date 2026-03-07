import httpClient from "../Base/HttpClient";

export const getCurrentUser = async () => {
  const response = await httpClient.get(`/users/me`);
  return response.data;
};

export const getAll = async () => {
  const response = await httpClient.get(`/users`);
  return response.data;
};

export const topUpBalance = async (userId, amount) => {
  const response = await httpClient.post(`/users/${userId}`, { amount });
  return response.data;
};
